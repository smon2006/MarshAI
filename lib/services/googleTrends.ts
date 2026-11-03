import { sleep } from "../utils";
const googleTrends = require("google-trends-api");

export interface TrendsDataPoint {
    time: string;
    value: number;
}

export interface RelatedQuery {
    query: string;
    value: number;
}

export interface TrendsAnalysisResult {
    keyword: string;
    timelineData: TrendsDataPoint[];
    averageInterest: number;
    growthRate: number;
    trend: "rising" | "declining" | "stable";
    relatedQueries: {
        top: RelatedQuery[];
        rising: RelatedQuery[];
    };
    regionalInterest: { geo: string; value: number }[];
    insights?: string[];

}

 
/// Google trends service for analyzing search trends.

export class GoogleTrendsService {

    // Get interest over time for a keyword 

    async getInterestOverTime(
        keyword: string,
        startTime: Date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // last 1 year ago
        endTime: Date = new Date(),
        geo: string = ""
    ) : Promise<TrendsDataPoint[]> {
        try {
            const result = await googleTrends.interestOverTime({
                keyword,
                startTime,
                endTime,
                geo,
            });

        const data = JSON.parse(result);
        const timelineData: TrendsDataPoint[] = [];

        if (data?.default?.timelineData) {
            data.default.timelineData.forEach((point: any) => {
                timelineData.push({
                    time: point.formattedTime,
                    value: point.value[0]
                });
            });
        }

        await sleep(2000) ; // Rate limiting 

         return timelineData;
        } catch (error) {
            console.error("Error fetching google trends data", error);
            return [];
        }
    }


    /**
   * Get related queries for a keyword
   */
  async getRelatedQueries(
    keyword: string,
    startTime: Date = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    endTime: Date = new Date(),
    geo: string = ""
  ): Promise<{ top: RelatedQuery[]; rising: RelatedQuery[] }> {
    try {
      const result = await googleTrends.relatedQueries({
        keyword,
        startTime,
        endTime,
        geo,
      });

      const data = JSON.parse(result);
      const relatedQueries: { top: RelatedQuery[]; rising: RelatedQuery[] } = {
        top: [],
        rising: [],
      };

      // Top queries
      if (data?.default?.rankedList?.[0]?.rankedKeyword) {
        relatedQueries.top = data.default.rankedList[0].rankedKeyword.map((item: any) => ({
          query: item.query,
          value: item.value,
        }));
      }

      // Rising queries
      if (data?.default?.rankedList?.[1]?.rankedKeyword) {
        relatedQueries.rising = data.default.rankedList[1].rankedKeyword.map((item: any) => ({
          query: item.query,
          value: item.value,
        }));
      }

      await sleep(2000); // Rate limiting

      return relatedQueries;
    } catch (error) {
      console.error("Error fetching related queries:", error);
      return { top: [], rising: [] };
    }
  }


 /**
   * Get interest by region
   */
  async getInterestByRegion(
    keyword: string,
    startTime: Date = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endTime: Date = new Date(),
    geo: string = ""
  ): Promise<{ geo: string; value: number }[]> {
    try {
      const result = await googleTrends.interestByRegion({
        keyword,
        startTime,
        endTime,
        geo,
      });

      const data = JSON.parse(result);
      const regionalData: { geo: string; value: number }[] = [];

      if (data?.default?.geoMapData) {
        data.default.geoMapData.forEach((region: any) => {
          regionalData.push({
            geo: region.geoName,
            value: region.value[0],
          });
        });
      }

      await sleep(2000); // Rate limiting

      return regionalData.sort((a, b) => b.value - a.value).slice(0, 10);
    } catch (error) {
      console.error("Error fetching regional interest:", error);
      return [];
    }
  }


   /**
   * Comprehensive analysis of a keyword
   */
  async analyzeKeyword(
    keyword: string,
    isPro: boolean = false
  ): Promise<TrendsAnalysisResult> {
    // Pro gets 12 months, Free gets 3 months
    const monthsBack = isPro ? 12 : 3;
    const startTime = new Date(Date.now() - monthsBack * 30 * 24 * 60 * 60 * 1000);
    const endTime = new Date();

    // Get timeline data
    const timelineData = await this.getInterestOverTime(keyword, startTime, endTime);

    // Calculate average interest
    const averageInterest =
      timelineData.length > 0
        ? Math.round(
            timelineData.reduce((sum, point) => sum + point.value, 0) / timelineData.length
          )
        : 0;

    // Calculate growth rate (compare first quarter to last quarter)
    const growthRate = this.calculateGrowthRate(timelineData);

    // Determine trend direction
    let trend: "rising" | "declining" | "stable" = "stable";
    if (growthRate > 10) trend = "rising";
    else if (growthRate < -10) trend = "declining";

    // Get related queries
    const relatedQueries = await this.getRelatedQueries(keyword, startTime, endTime);

    // Get regional interest
    const regionalInterest = await this.getInterestByRegion(keyword, startTime, endTime);

    // Generate insights
    const insights = this.generateInsights({
      keyword,
      timelineData,
      averageInterest,
      growthRate,
      trend,
      relatedQueries,
      regionalInterest,
    });

    return {
      keyword,
      timelineData,
      averageInterest,
      growthRate,
      trend,
      relatedQueries,
      regionalInterest,
      insights,
    };
  }


 /**
   * Calculate growth rate between first and last quarters
   */
  private calculateGrowthRate(data: TrendsDataPoint[]): number {
    if (data.length < 4) return 0;

    const quarterSize = Math.floor(data.length / 4);
    const firstQuarter = data.slice(0, quarterSize);
    const lastQuarter = data.slice(-quarterSize);

    const firstAvg =
      firstQuarter.reduce((sum, point) => sum + point.value, 0) / firstQuarter.length;
    const lastAvg =
      lastQuarter.reduce((sum, point) => sum + point.value, 0) / lastQuarter.length;

    if (firstAvg === 0) return 0;

    return Math.round(((lastAvg - firstAvg) / firstAvg) * 100);
  }

  /**
   * Generate insights from trends data
   */
  private generateInsights(data: TrendsAnalysisResult): string[] {
    const insights: string[] = [];

    // Interest level insight
    if (data.averageInterest > 70) {
      insights.push(
        `High search interest (${data.averageInterest}/100) indicates strong market demand`
      );
    } else if (data.averageInterest > 40) {
      insights.push(
        `Moderate search interest (${data.averageInterest}/100) shows decent market potential`
      );
    } else if (data.averageInterest > 0) {
      insights.push(
        `Low search interest (${data.averageInterest}/100) suggests Domain Idea or emerging market`
      );
    } else {
      insights.push("Very low search volume - consider validating through other channels");
    }

    // Growth trend insight
    if (data.trend === "rising" && data.growthRate > 0) {
      insights.push(
        `${data.growthRate}% growth indicates rising interest - good timing for market entry`
      );
    } else if (data.trend === "declining") {
      insights.push(
        `${Math.abs(data.growthRate)}% decline in interest - market may be saturating or shifting`
      );
    } else {
      insights.push("Stable interest over time suggests established market with consistent demand");
    }

    // Related queries insight
    if (data.relatedQueries.rising.length > 5) {
      insights.push(
        `${data.relatedQueries.rising.length} rising related queries show expanding market interest`
      );
    }

    // Regional insight
    if (data.regionalInterest.length > 0) {
      const topRegion = data.regionalInterest[0];
      insights.push(`Highest interest in ${topRegion.geo} with ${topRegion.value}/100 score`);
    }

    // Seasonality detection (basic)
    if (data.timelineData.length >= 12) {
      const variance = this.calculateVariance(data.timelineData.map((d) => d.value));
      if (variance > 500) {
        insights.push("High variance detected - possible seasonal trends or cyclical demand");
      }
    }

    return insights;
  }

  /**
   * Calculate variance for seasonality detection
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return variance;
  }



  
}







 