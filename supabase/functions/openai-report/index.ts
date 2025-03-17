
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.13.0";
import { corsHeaders } from "../cors.ts";

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse request body
    const requestBody = await req.json();
    const { auditResult, templateType, customPrompt, apiKey } = requestBody;

    // Validate request
    if (!auditResult) {
      console.error("No audit data provided");
      return new Response(
        JSON.stringify({ error: "No audit data provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!apiKey) {
      console.error("No API key provided");
      return new Response(
        JSON.stringify({ error: "No API key provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Processing request for template type:", templateType);
    console.log("Company name:", auditResult.companyName);

    // Initialize OpenAI with the provided API key
    const openai = new OpenAI({ apiKey });
    
    // Get the correct system prompt based on template type
    const systemPrompt = getSystemPrompt(templateType);
    
    // Prepare the user prompt with audit data
    const combinedPrompt = customPrompt 
      ? `${customPrompt}\n\nAudit data: ${JSON.stringify(auditResult)}` 
      : `Generate a detailed SEO report for ${auditResult.companyName} based on this audit data: ${JSON.stringify(auditResult)}`;

    console.log("Calling OpenAI API");
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: combinedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    // Extract and return content
    const generatedContent = response.choices[0].message.content;
    
    console.log("Report generated successfully, length:", generatedContent.length);
    
    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to get the appropriate system prompt based on template type
function getSystemPrompt(templateType: string): string {
  const basePrompt = "You are an expert SEO consultant preparing detailed reports for clients. ";
  
  switch (templateType) {
    case 'seo':
      return basePrompt + "Create a comprehensive SEO report with executive summary, findings, recommendations, and implementation strategy. Focus on technical SEO issues, content quality, backlinks, keywords, and competitor analysis.";
    
    case 'local':
      return basePrompt + "Create a local SEO report focused on Google Business Profile optimization, local citations, review management, and local link building. Include specific recommendations for local search visibility.";
    
    case 'technical':
      return basePrompt + "Create a technical SEO audit focusing on site speed, mobile usability, crawlability, indexability, and technical issues. Include detailed explanations and prioritized fixes.";
    
    case 'performance':
      return basePrompt + "Create a website performance report focusing on Core Web Vitals, page speed, user experience metrics, and performance optimization. Include specific recommendations for improvement.";
    
    default:
      return basePrompt + "Create a comprehensive SEO report with executive summary, findings, and actionable recommendations.";
  }
}
