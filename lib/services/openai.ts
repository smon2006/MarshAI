import OpenAI from "openai";
import { TrendsAnalysisResult } from "./googleTrends";
 
export interface AIMarketInsights {
  summary: string;
  opportunityAssessment: {
    score: number; // 0-100
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
  }; 
  targetAudience: {
    demographics: string;
    psychographics: string;
    painPoints: string[];
  };
  competitionAnalysis: {
    level: "low" | "medium" | "high";
    keyPlayers: string[];
    differentiationOpportunities: string[];
  };
  monetizationStrategies: {
    primary: string;
    secondary: string[];
    estimatedRevenuePotential: string;
  };
  businessIdeas: {
    idea: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    timeToLaunch: string;
    estimatedCost: string;
    revenueModel: string;
    targetMarket: string;
  }[];
  gtmStrategy: {
    phase1: string[];
    phase2: string[];
    phase3: string[];
    quickWins: string[];
  };
  risks: string[];
  recommendations: string[];
  wordCount: number;
}

/**
 * OpenAI Service for generating AI-powered market insights
 */
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    // Groq exposes an OpenAI-compatible API, so the same SDK works.
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  /**
   * Generate comprehensive market insights
   */
  async generateMarketInsights(
    DomainIdea: string,
    keyword: string,
    trendsData: TrendsAnalysisResult,
    isPro: boolean = false
  ): Promise<AIMarketInsights> {
    const maxTokens = isPro ? 5000 : 3500; // Pro gets longer reports (reasoning model also spends tokens thinking)
    const wordLimit = isPro ? 2000 : 500;

    const prompt = this.buildPrompt(DomainIdea, keyword, trendsData, wordLimit);

    try {
      const response = await this.openai.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are an expert market research analyst specializing in Domain Idea validation and business opportunity assessment. Provide detailed, actionable insights based on data.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: maxTokens,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      const insights = JSON.parse(content) as AIMarketInsights;
      insights.wordCount = this.countWords(JSON.stringify(insights));

      return insights;
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Return fallback insights
      return this.generateFallbackInsights(DomainIdea, keyword, trendsData);
    }
  }

  /**
   * Build prompt for OpenAI
   */
  private buildPrompt(
    DomainIdea: string,
    keyword: string,
    trendsData: TrendsAnalysisResult,
    wordLimit: number
  ): string {
    return `
Analyze this Domain Idea/market opportunity and provide comprehensive insights in JSON format.

**Domain Idea:** ${DomainIdea}
**Keyword:** ${keyword}

**Google Trends Data:**
- Average interest: ${trendsData.averageInterest}/100
- Growth rate: ${trendsData.growthRate}%
- Trend: ${trendsData.trend}
- Top related queries: ${trendsData.relatedQueries.top.slice(0, 5).map((q) => q.query).join(", ")}
- Rising queries: ${trendsData.relatedQueries.rising.slice(0, 5).map((q) => q.query).join(", ")}
- Top regions: ${trendsData.regionalInterest.slice(0, 3).map((r) => r.geo).join(", ")}

**Response Requirements:**
- Maximum ${wordLimit} words
- Return ONLY valid JSON (no markdown, no code blocks)
- Use this exact structure:

{
  "summary": "2-3 paragraph executive summary of the market opportunity",
  "opportunityAssessment": {
    "score": 75,
    "reasoning": "Explain the score",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "targetAudience": {
    "demographics": "Age, location, income, education",
    "psychographics": "Values, interests, behaviors",
    "painPoints": ["pain point 1", "pain point 2", "pain point 3"]
  },
  "competitionAnalysis": {
    "level": "low | medium | high",
    "keyPlayers": ["competitor 1", "competitor 2"],
    "differentiationOpportunities": ["opportunity 1", "opportunity 2"]
  },
  "monetizationStrategies": {
    "primary": "Main revenue model",
    "secondary": ["alternative model 1", "alternative model 2"],
    "estimatedRevenuePotential": "$X - $Y per month/year"
  },
  "businessIdeas": [
    {
      "idea": "Specific business idea name",
      "description": "Detailed description of the business idea and how it addresses the pain points",
      "difficulty": "Easy | Medium | Hard",
      "timeToLaunch": "2-4 weeks | 1-3 months | 3-6 months",
      "estimatedCost": "$500-$2000 | $2000-$10000 | etc",
      "revenueModel": "How this business will make money",
      "targetMarket": "Who will buy this product/service"
    }
  ],
  "gtmStrategy": {
    "phase1": ["action 1", "action 2"],
    "phase2": ["action 1", "action 2"],
    "phase3": ["action 1", "action 2"],
    "quickWins": ["quick win 1", "quick win 2"]
  },
  "risks": ["risk 1", "risk 2", "risk 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

**IMPORTANT for Business Ideas:**
- Generate 3-5 SPECIFIC, actionable business ideas based on the Domain Idea and pain points
- Make each idea unique and address different segments or approaches
- Be creative but realistic
- Include concrete details (pricing, features, target market)
- Range from easy/quick wins to more complex long-term ideas

Examples of good business ideas:
- "15-Minute Home Workout App" with specific features like "no equipment needed, office-friendly exercises"
- "AI-Powered Content Calendar Tool" with "automated topic suggestions based on trending keywords"
- "Eco-Friendly Fashion Subscription Box" with "curated sustainable brands, monthly delivery"

Provide realistic, data-driven insights. Be specific and actionable.
`;
  }

  /**
   * Generate fallback insights if OpenAI fails
   */
  private generateFallbackInsights(
    DomainIdea: string,
    keyword: string,
    trendsData: TrendsAnalysisResult
  ): AIMarketInsights {
    const score = this.calculateOpportunityScore(trendsData);

    return {
      summary: `Based on the analysis of "${keyword}", this Domain Idea shows ${score > 60 ? "promising" : "moderate"} potential. Google Trends shows ${trendsData.trend} interest with ${trendsData.averageInterest}/100 average search volume.`,
      opportunityAssessment: {
        score,
        reasoning: `Score based on search trends (${trendsData.trend}) and average interest level (${trendsData.averageInterest}/100).`,
        strengths: [
          trendsData.trend === "rising" ? "Growing market interest" : "Stable market demand",
          `Average search interest: ${trendsData.averageInterest}/100`,
          `Related queries showing market activity`,
        ],
        weaknesses: [
          trendsData.averageInterest < 40
            ? "Limited search volume"
            : "Potential competition from search volume",
          "Manual research needed for deeper validation",
        ],
      },
      targetAudience: {
        demographics: "Active online searchers interested in this Domain Idea",
        psychographics: "Problem-aware individuals seeking solutions",
        painPoints: [
          "Finding reliable information",
          "Understanding best practices",
          "Implementing effective solutions",
          "Staying updated with trends",
          "Cost-effective alternatives",
        ],
      },
      competitionAnalysis: {
        level: trendsData.averageInterest > 60 ? "high" : trendsData.averageInterest > 30 ? "medium" : "low",
        keyPlayers: ["Research required for specific competitors"],
        differentiationOpportunities: [
          "Focus on specific pain points",
          "Target underserved segments",
          "Provide unique value proposition",
        ],
      },
      monetizationStrategies: {
        primary: "SaaS subscription model",
        secondary: [
          "One-time digital products",
          "Consulting services",
          "Affiliate partnerships",
        ],
        estimatedRevenuePotential: "Requires further market validation",
      },
      businessIdeas: [
        {
          idea: `${DomainIdea} - SaaS Solution`,
          description: `Create a software-as-a-service platform that addresses key challenges in the ${keyword} market. Focus on solving common problems with an innovative approach.`,
          difficulty: "Medium",
          timeToLaunch: "2-4 months",
          estimatedCost: "₹475997-₹1427993",
          revenueModel: "Monthly subscription (₹2500-₹9424/month)",
          targetMarket: `${keyword} enthusiasts and professionals`,
        },
        {
          idea: `${DomainIdea} - Educational Course`,
          description: `Develop a comprehensive online course teaching people how to succeed in ${keyword}. Include video lessons, worksheets, and community support.`,
          difficulty: "Easy",
          timeToLaunch: "4-8 weeks",
          estimatedCost: "$1,000-$3,000",
          revenueModel: "One-time purchase (₹4664-₹18944)",
          targetMarket: "Beginners and intermediate users",
        },
        {
          idea: `${DomainIdea} - Content & Community`,
          description: `Build a content-driven platform with blog, newsletter, and community forum focused on ${keyword}. Monetize through ads, sponsorships, and premium membership.`,
          difficulty: "Easy",
          timeToLaunch: "2-6 weeks",
          estimatedCost: "₹47599-₹190399",
          revenueModel: "Ads, sponsorships, premium membership",
          targetMarket: "Content consumers and community seekers",
        },
      ],
      gtmStrategy: {
        phase1: [
          "Build MVP based on market research",
          "Engage in relevant online communities",
          "Create content addressing pain points",
          "Set up analytics and tracking",
        ],
        phase2: [
          "Launch beta to early adopters",
          "Collect user feedback",
          "Refine product-market fit",
          "Start paid marketing campaigns",
        ],
        phase3: [
          "Scale marketing efforts",
          "Expand feature set",
          "Build partnerships",
          "Optimize conversion funnel",
        ],
        quickWins: [
          "Create valuable content",
          "Build email list",
          "Engage with target audience online",
          "Launch MVP or beta version",
        ],
      },
      risks: [
        "Market size may be smaller than estimated",
        "Competition from established players",
        "Changing market dynamics",
      ],
      recommendations: [
        "Validate with direct customer interviews",
        "Build in public to test demand",
        "Start with a focused Domain Idea segment",
      ],
      wordCount: 500,
    };
  }

  /**
   * Calculate opportunity score based on data
   */
  private calculateOpportunityScore(
    trendsData: TrendsAnalysisResult
  ): number {
    let score = 50; // Base score

    // Trends factor (max 25 points)
    if (trendsData.trend === "rising") score += 25;
    else if (trendsData.trend === "stable") score += 15;
    else score += 5;

    // Average interest factor (max 25 points)
    if (trendsData.averageInterest > 70) score += 25;
    else if (trendsData.averageInterest > 50) score += 20;
    else if (trendsData.averageInterest > 30) score += 15;
    else if (trendsData.averageInterest > 10) score += 10;
    else score += 5;

    // Growth rate factor (max 15 points)
    if (trendsData.growthRate > 50) score += 15;
    else if (trendsData.growthRate > 20) score += 10;
    else if (trendsData.growthRate > 0) score += 5;
    else if (trendsData.growthRate > -20) score += 0;
    else score -= 5;

    // Related queries factor (max 10 points)
    if (trendsData.relatedQueries.rising.length > 5) score += 10;
    else if (trendsData.relatedQueries.rising.length > 2) score += 7;
    else score += 3;

    return Math.min(Math.max(score, 0), 100);
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }
}