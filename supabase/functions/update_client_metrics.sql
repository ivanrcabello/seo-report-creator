
CREATE OR REPLACE FUNCTION public.update_client_metric(p_id uuid, p_client_id uuid, p_month text, p_web_visits integer, p_keywords_top10 integer, p_conversions integer, p_conversion_goal integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.client_metrics
  SET 
    month = TO_DATE(p_month, 'YYYY-MM-DD'),
    web_visits = p_web_visits,
    keywords_top10 = p_keywords_top10,
    conversions = p_conversions,
    conversion_goal = p_conversion_goal,
    updated_at = NOW()
  WHERE id = p_id AND client_id = p_client_id;
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.insert_client_metric(p_client_id uuid, p_month text, p_web_visits integer, p_keywords_top10 integer, p_conversions integer, p_conversion_goal integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.client_metrics(
    client_id,
    month,
    web_visits,
    keywords_top10,
    conversions,
    conversion_goal
  )
  VALUES (
    p_client_id,
    TO_DATE(p_month, 'YYYY-MM'),
    p_web_visits,
    p_keywords_top10,
    p_conversions,
    p_conversion_goal
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$function$;
