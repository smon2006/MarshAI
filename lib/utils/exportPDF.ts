import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Report {
  id: string;
  DomainIdea: string;
  keyword: string;
  status: string;
  overallScore: number;
  viabilityRating: string;
  trendsData: any;
  aiInsights: any;
  createdAt: string;
}

/**
 * jsPDF's built-in Helvetica only supports Latin-1/WinAnsi characters.
 * Anything else (emoji, arrows, ₹, ≥, non-breaking hyphens, zero-width chars...)
 * renders as garbled, spaced-out text, so map the common ones and strip the rest.
 */
const sanitize = (input: unknown): string => {
  if (input === null || input === undefined) return "N/A";
  return String(input)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010\u2011\u2012\u2212]/g, "-")
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u00A0\u2002\u2003\u2009\u202F]/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u20B9/g, "Rs. ")
    .replace(/\u2192/g, "->")
    .replace(/\u2190/g, "<-")
    .replace(/\u2265/g, ">=")
    .replace(/\u2264/g, "<=")
    .replace(/[\u2022\u25CF\u25AA\u25E6]/g, "-")
    .replace(/[\u2713\u2714]/g, "")
    // strip anything left outside Latin-1 (emoji, symbols, other scripts)
    .replace(/[^\n\x20-\x7E\u00A1-\u00FF]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
};

export const exportReportToPDF = (report: Report) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const topMargin = 20;
  const bottomLimit = pageHeight - 20; // keep clear of the footer
  const contentWidth = pageWidth - marginX * 2;
  const BLUE: [number, number, number] = [59, 130, 246];
  let y = topMargin;

  const ensureSpace = (needed: number) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = topMargin;
    }
  };

  // Real line height (mm) for the current font size
  const lineHeight = (fontSize: number) => (fontSize * 1.2) / doc.internal.scaleFactor;

  const setFont = (size: number, style: "normal" | "bold" = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(0, 0, 0);
  };

  /** Wrapped text that flows across pages line by line, so nothing gets cut off. */
  const paragraph = (
    text: unknown,
    opts: { x?: number; width?: number; size?: number; style?: "normal" | "bold"; gap?: number } = {},
  ) => {
    const { x = marginX, width = contentWidth, size = 10, style = "normal", gap = 3 } = opts;
    setFont(size, style);
    const lh = lineHeight(size);
    const lines: string[] = doc.splitTextToSize(sanitize(text), width);
    lines.forEach((line) => {
      ensureSpace(lh);
      y += lh; // jsPDF draws text from the baseline
      doc.text(line, x, y - lh * 0.25);
    });
    y += gap;
  };

  const sectionTitle = (title: string) => {
    ensureSpace(20); // keep the heading together with some content
    paragraph(title, { size: 16, style: "bold", gap: 4 });
  };

  const subTitle = (title: string) => {
    ensureSpace(16);
    paragraph(title, { size: 12, style: "bold", gap: 2 });
  };

  /** Bullet list with a hanging indent so wrapped lines align. */
  const bullets = (items?: unknown[]) => {
    if (!Array.isArray(items)) return;
    const size = 10;
    const lh = lineHeight(size);
    items.forEach((item) => {
      setFont(size);
      const lines: string[] = doc.splitTextToSize(sanitize(item), contentWidth - 10);
      lines.forEach((line, i) => {
        ensureSpace(lh);
        y += lh;
        if (i === 0) doc.text("-", marginX + 4, y - lh * 0.25);
        doc.text(line, marginX + 9, y - lh * 0.25);
      });
      y += 2;
    });
    y += 4;
  };

  const table = (
    body: unknown[][],
    opts: { head?: string[]; theme?: "grid" | "striped" | "plain"; left?: number; fontSize?: number } = {},
  ) => {
    const { head, theme = "grid", left = marginX, fontSize = 10 } = opts;
    ensureSpace(20);
    autoTable(doc, {
      startY: y,
      head: head ? [head.map(sanitize)] : [],
      body: body.map((row) => row.map(sanitize)),
      theme,
      styles: {
        font: "helvetica",
        fontSize,
        cellPadding: 2.5,
        overflow: "linebreak", // wrap long text inside cells instead of cutting it off
        valign: "top",
      },
      headStyles: { fillColor: BLUE, textColor: 255 },
      columnStyles: head ? undefined : { 0: { fontStyle: "bold", cellWidth: 40 } },
      margin: { left, right: marginX, bottom: 20 },
      tableWidth: pageWidth - left - marginX,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  };

  // ===== HEADER =====
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Domain Idea Validation Report", pageWidth / 2, 20, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: "center" });
  y = 52;

  // ===== OVERVIEW =====
  sectionTitle("Overview");
  table([
    ["Domain Idea", report.DomainIdea],
    ["Keyword", report.keyword],
    ["Overall Score", `${report.overallScore}/100`],
    ["Viability Rating", report.viabilityRating],
    ["Status", report.status],
  ]);

  // ===== OPPORTUNITY ASSESSMENT =====
  const assessment = report.aiInsights?.opportunityAssessment;
  if (assessment) {
    sectionTitle("Opportunity Assessment");
    paragraph(assessment.reasoning || "No reasoning provided", { gap: 6 });
    if (assessment.strengths?.length) {
      subTitle("Strengths");
      bullets(assessment.strengths);
    }
    if (assessment.weaknesses?.length) {
      subTitle("Weaknesses");
      bullets(assessment.weaknesses);
    }
  }

  // ===== GOOGLE TRENDS =====
  const trends = report.trendsData;
  if (trends) {
    sectionTitle("Google Trends Analysis");
    const growth = Number(trends.growthRate);
    table([
      ["Average Interest", `${trends.averageInterest ?? "N/A"}/100`],
      [
        "Growth Rate",
        Number.isFinite(growth) ? `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%` : "N/A",
      ],
      ["Trend", trends.trend],
    ]);

    const top = trends.relatedQueries?.top;
    if (Array.isArray(top) && top.length > 0) {
      subTitle("Top Related Queries");
      table(
        top.slice(0, 5).map((q: any) => [q.query, q.value]),
        { head: ["Query", "Value"], theme: "striped" },
      );
    }
  }

  // ===== BUSINESS IDEAS =====
  const ideas = report.aiInsights?.businessIdeas;
  if (Array.isArray(ideas) && ideas.length > 0) {
    sectionTitle("Business Ideas");
    ideas.forEach((idea: any, index: number) => {
      ensureSpace(45);
      paragraph(`${index + 1}. ${idea.idea}`, { size: 12, style: "bold", gap: 2 });
      paragraph(idea.description, { x: marginX + 4, width: contentWidth - 4, gap: 3 });
      table(
        [
          ["Difficulty", idea.difficulty],
          ["Time to Launch", idea.timeToLaunch],
          ["Estimated Cost", idea.estimatedCost],
          ["Revenue Model", idea.revenueModel],
        ],
        { theme: "plain", left: marginX + 4, fontSize: 9 },
      );
    });
  }

  // ===== GO-TO-MARKET =====
  const gtm = report.aiInsights?.gtmStrategy;
  if (gtm) {
    sectionTitle("Go-to-Market Strategy");
    const phases: [string, any[]][] = [
      ["Quick Wins", gtm.quickWins],
      ["Phase 1: Foundation (Weeks 1-4)", gtm.phase1],
      ["Phase 2: Growth (Weeks 5-12)", gtm.phase2],
      ["Phase 3: Scale (Month 4+)", gtm.phase3],
    ];
    phases.forEach(([title, items]) => {
      if (items?.length > 0) {
        subTitle(title);
        bullets(items);
      }
    });
  }

  // ===== RISKS & RECOMMENDATIONS =====
  const risks = report.aiInsights?.risks;
  const recs = report.aiInsights?.recommendations;
  if (risks?.length > 0 || recs?.length > 0) {
    sectionTitle("Risks & Recommendations");
    if (risks?.length > 0) {
      subTitle("Risks");
      bullets(risks);
    }
    if (recs?.length > 0) {
      subTitle("Recommendations");
      bullets(recs);
    }
  }

  // ===== FOOTER ON EVERY PAGE =====
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${totalPages} | Generated by MarshAI`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  }

  const safeKeyword = sanitize(report.keyword).replace(/[^\w-]+/g, "_") || "report";
  doc.save(`${safeKeyword}_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};