-- Índices de performance para colunas de busca e ordenação frequentes

-- Projetos
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects (category_id);
CREATE INDEX IF NOT EXISTS idx_projects_start_date  ON projects (start_date DESC);

-- Relação N:N projetos ↔ temas
CREATE INDEX IF NOT EXISTS idx_ppt_project_id ON project_project_themes (project_id);
CREATE INDEX IF NOT EXISTS idx_ppt_theme_id   ON project_project_themes (theme_id);

-- Membros da equipe
CREATE INDEX IF NOT EXISTS idx_team_members_category_id ON team_members (category_id);
CREATE INDEX IF NOT EXISTS idx_team_members_active      ON team_members (active);

-- Eventos
CREATE INDEX IF NOT EXISTS idx_events_date            ON events (date DESC);
CREATE INDEX IF NOT EXISTS idx_events_featured        ON events (featured);
CREATE INDEX IF NOT EXISTS idx_events_organization_id ON events (organization_id);

-- Módulos de hardware
CREATE INDEX IF NOT EXISTS idx_hardware_modules_hardware_id ON hardware_modules (hardware_id, sort_order);

-- Canais de contato
CREATE INDEX IF NOT EXISTS idx_contact_channels_info_id ON contact_channels (contact_info_id, sort_order);

-- Linha do tempo
CREATE INDEX IF NOT EXISTS idx_timeline_date ON about_timeline_entries (date DESC);

-- Sessões de autenticação
CREATE INDEX IF NOT EXISTS idx_auth_session_user_id ON auth_session (user_id);
