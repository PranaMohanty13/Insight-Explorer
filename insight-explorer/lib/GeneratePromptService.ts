export interface CallData {
    id: number;
    transcript: string;
    sentiment: number;
    timeOfDay: string;
    outcome: string;
    callerLocation: string;
    createdAt: string;
  }
  

  export function generatePrompt(calls: CallData[]): string {
    return `Please analyze the following call data and provide a comprehensive, conversational report with clear paragraphs and actionable insights. In your analysis, explain in plain language what might be contributing to the observed outcomes.
    
  Call Details:
  ${calls
      .map(
        (c) =>
          `• Call ID ${c.id}:
    Transcript: ${c.transcript}
    Sentiment: ${c.sentiment}
    Time of Day: ${c.timeOfDay}
    Outcome: ${c.outcome}
    Location: ${c.callerLocation}
    Date: ${c.createdAt}
  `
      )
      .join("\n")}`;
  }
  