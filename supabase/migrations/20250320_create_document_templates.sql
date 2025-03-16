
-- Crear tabla de plantillas de documentos
create table if not exists document_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  document_type text not null,
  is_default boolean default false,
  sections jsonb,
  header_html text,
  footer_html text,
  cover_page_html text,
  css text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear índice para búsquedas por tipo de documento
create index if not exists idx_document_templates_document_type on document_templates(document_type);

-- Crear índice para obtener plantillas por defecto
create index if not exists idx_document_templates_is_default on document_templates(is_default) where is_default = true;

-- Función para actualizar el timestamp de updated_at
create or replace function update_updated_at_document_templates()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger para actualizar updated_at automáticamente
create trigger update_document_templates_updated_at
  before update on document_templates
  for each row
  execute function update_updated_at_document_templates();

-- Asegurar que solo haya una plantilla por defecto por tipo de documento
create or replace function ensure_single_default_template()
returns trigger as $$
begin
  if new.is_default then
    update document_templates
    set is_default = false
    where document_type = new.document_type
      and id != new.id
      and is_default = true;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger ensure_single_default_template_trigger
  before insert or update on document_templates
  for each row
  execute function ensure_single_default_template();
