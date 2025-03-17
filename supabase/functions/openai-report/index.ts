
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.15.3/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({
          error: "OpenAI API key is not configured in the environment",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { auditResult, templateType, customPrompt } = requestData;
    
    console.log("Processing OpenAI report request");
    console.log("Template type:", templateType);
    console.log("Custom prompt provided:", !!customPrompt);
    console.log("Audit Result company name:", auditResult.companyName);

    if (!auditResult || !auditResult.companyName) {
      console.error("Missing required data:", { 
        hasAuditResult: !!auditResult, 
        hasCompanyName: auditResult ? !!auditResult.companyName : false 
      });
      throw new Error("Invalid request body: auditResult or companyName missing");
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });
    
    // Create a base system prompt based on template type
    let systemPrompt = `You are an expert SEO consultant. Your task is to create a comprehensive SEO report for ${auditResult.companyName}. `;
    
    switch (templateType) {
      case 'seo':
        systemPrompt += "Focus on general SEO aspects including content quality, keyword optimization, and meta data.";
        break;
      case 'local':
        systemPrompt += "Focus specifically on local SEO factors including Google Business Profile, local citations, and local keywords.";
        break;
      case 'technical':
        systemPrompt += "Focus on technical SEO aspects including site speed, mobile-friendliness, crawlability, and indexation issues.";
        break;
      case 'performance':
        systemPrompt += "Focus on website performance including Core Web Vitals, page speed, and user experience metrics.";
        break;
      default:
        systemPrompt += "Provide a general SEO analysis covering all key aspects of search engine optimization.";
    }
    
    // Add detailed instructions for report formatting
    systemPrompt += `
    Structure your report as follows:
    1. Executive Summary - Provide a brief overview of key findings
    2. Current Performance Analysis - Analyze the current state based on provided metrics
    3. Strengths and Weaknesses - Identify what's working well and what needs improvement
    4. Recommendations - Provide specific, actionable recommendations
    5. Conclusion - Summarize the main points and expected outcomes from implementing recommendations
    
    Format your report with markdown. Use headers, bullet points, and bold text for readability.
    If you're given keyword data, analyze the performance and provide insights on how to improve rankings.
    Be specific and data-driven in your analysis and recommendations.
    `;
    
    // Add custom prompt if provided
    if (customPrompt) {
      systemPrompt += `\n\nAdditional instructions: ${customPrompt}`;
      console.log("Added custom prompt to system instructions");
    }

    console.log("Starting OpenAI chat completion");
    
    // Select model from config.toml or use default
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    console.log(`Using OpenAI model: ${model}`);
    
    // Generate the report using OpenAI
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create a detailed SEO report for ${auditResult.companyName} based on this data: ${JSON.stringify(auditResult, null, 2)}` 
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    console.log("OpenAI response received");
    
    if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message) {
      console.error("No choices in OpenAI response:", completion);
      throw new Error("No content received from OpenAI");
    }
    
    const content = completion.choices[0].message.content;
    
    if (!content) {
      console.error("Empty content received from OpenAI");
      throw new Error("Empty content received from OpenAI");
    }
    
    console.log("Report generated successfully");
    console.log("Content length:", content.length);
    console.log("Content preview:", content.substring(0, 100) + "...");

    return new Response(
      JSON.stringify({
        content: content,
        model: model,
        usage: completion.usage
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An unknown error occurred",
        stack: error.stack || "No stack trace available"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
