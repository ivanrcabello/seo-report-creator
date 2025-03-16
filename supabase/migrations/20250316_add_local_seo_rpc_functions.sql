
-- Función para insertar o actualizar configuraciones básicas de SEO local
CREATE OR REPLACE FUNCTION public.upsert_local_seo_settings(
  client_id UUID,
  business_name TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  google_business_url TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_record JSONB;
  existing_id UUID;
BEGIN
  -- Check if record exists
  SELECT id INTO existing_id FROM client_local_seo_settings WHERE client_id = $1;
  
  IF existing_id IS NOT NULL THEN
    -- Update
    UPDATE client_local_seo_settings
    SET 
      business_name = $2,
      address = $3,
      phone = $4,
      website = $5,
      google_business_url = $6,
      updated_at = NOW()
    WHERE id = existing_id
    RETURNING to_jsonb(client_local_seo_settings.*) INTO result_record;
  ELSE
    -- Insert
    INSERT INTO client_local_seo_settings (
      client_id, 
      business_name, 
      address, 
      phone, 
      website, 
      google_business_url
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING to_jsonb(client_local_seo_settings.*) INTO result_record;
  END IF;
  
  RETURN result_record;
END;
$$;

-- Función completa para insertar o actualizar configuraciones de SEO local con todos los campos
CREATE OR REPLACE FUNCTION public.upsert_complete_local_seo_settings(
  p_id UUID,
  p_client_id UUID,
  p_business_name TEXT,
  p_address TEXT,
  p_phone TEXT,
  p_website TEXT,
  p_google_business_url TEXT,
  p_target_locations TEXT[],
  p_google_reviews_count INTEGER,
  p_google_reviews_average NUMERIC,
  p_listings_count INTEGER,
  p_google_maps_ranking INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_record JSONB;
  existing_id UUID;
BEGIN
  -- Check if ID is provided and exists
  IF p_id IS NOT NULL THEN
    SELECT id INTO existing_id FROM client_local_seo_settings WHERE id = p_id;
  ELSE
    -- Check if record exists by client_id
    SELECT id INTO existing_id FROM client_local_seo_settings WHERE client_id = p_client_id;
  END IF;
  
  IF existing_id IS NOT NULL THEN
    -- Update
    UPDATE client_local_seo_settings
    SET 
      business_name = p_business_name,
      address = p_address,
      phone = p_phone,
      website = p_website,
      google_business_url = p_google_business_url,
      target_locations = p_target_locations,
      google_reviews_count = p_google_reviews_count,
      google_reviews_average = p_google_reviews_average,
      listings_count = p_listings_count,
      google_maps_ranking = p_google_maps_ranking,
      updated_at = NOW()
    WHERE id = existing_id
    RETURNING to_jsonb(client_local_seo_settings.*) INTO result_record;
  ELSE
    -- Insert
    INSERT INTO client_local_seo_settings (
      client_id, 
      business_name, 
      address, 
      phone, 
      website, 
      google_business_url,
      target_locations,
      google_reviews_count,
      google_reviews_average,
      listings_count,
      google_maps_ranking
    )
    VALUES (
      p_client_id, 
      p_business_name, 
      p_address, 
      p_phone, 
      p_website, 
      p_google_business_url,
      p_target_locations,
      p_google_reviews_count,
      p_google_reviews_average,
      p_listings_count,
      p_google_maps_ranking
    )
    RETURNING to_jsonb(client_local_seo_settings.*) INTO result_record;
  END IF;

  -- Si se actualizaron las métricas, también las guardamos en la tabla de historial
  INSERT INTO local_seo_metrics (
    client_id,
    google_maps_ranking,
    google_reviews_count,
    google_reviews_average,
    listings_count,
    date
  )
  VALUES (
    p_client_id,
    p_google_maps_ranking,
    p_google_reviews_count,
    p_google_reviews_average,
    p_listings_count,
    NOW()
  );
  
  RETURN result_record;
END;
$$;

-- Asegúrate de que exista una política de seguridad que permita a los usuarios autenticados insertar y actualizar
ALTER TABLE public.client_local_seo_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios autenticados leer, insertar y actualizar sus propios datos
CREATE POLICY "Allow authenticated users full access" ON public.client_local_seo_settings
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- También asegúrate de que los usuarios autenticados puedan insertar métricas
ALTER TABLE public.local_seo_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access" ON public.local_seo_metrics
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
