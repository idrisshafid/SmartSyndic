--SMART SYNDIC VACANCES — DATABASE COMPLETE
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ─────────────────────────────────────────────
--  ENUMS
-- ─────────────────────────────────────────────
CREATE TYPE user_role          AS ENUM ('admin','syndic','owner');
CREATE TYPE apartment_status   AS ENUM ('available','occupied','maintenance');
CREATE TYPE payment_status     AS ENUM ('pending','validated','overdue');
CREATE TYPE incident_status    AS ENUM ('pending','in_progress','resolved');
CREATE TYPE incident_priority  AS ENUM ('low','normal','high','urgent');
CREATE TYPE reservation_status AS ENUM ('pending','confirmed','cancelled');
CREATE TYPE notification_type  AS ENUM ('payment','incident','reservation','announcement','general');

-- ★ 3 créneaux fixes par jour
CREATE TYPE time_slot AS ENUM ('09:00','14:00','17:00');

-- ─────────────────────────────────────────────
--  1. USERS
-- Admin / Syndic / Propriétaire
-- Les visiteurs ne possèdent pas de compte.
--       (un propriétaire peut être étranger)
-- ─────────────────────────────────────────────
CREATE TABLE users (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) UNIQUE NOT NULL,
    password            VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    phone               VARCHAR(20),
    role                user_role    NOT NULL DEFAULT 'owner',

    -- ★ country pour le propriétaire (owner de l'appartement)
    --   NULL pour les autres rôles
    country             VARCHAR(100),
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    avatar_url          VARCHAR(500),
    reset_token         VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN users.country IS
  '★ Pays du propriétaire (ex: France, Espagne). NULL pour admin/syndic/visitor.';

-- ─────────────────────────────────────────────
--  2. RESIDENCES
--     ★ country SUPPRIMÉ — toutes les résidences sont au Maroc
-- ─────────────────────────────────────────────
CREATE TABLE residences (
    id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    syndic_id   UUID         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    address     VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude    DECIMAL(10,8),
    longitude   DECIMAL(11,8),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
-- Photos de la résidence
CREATE TABLE residence_photos (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    residence_id UUID         NOT NULL REFERENCES residences(id) ON DELETE CASCADE,
    photo_url    VARCHAR(500) NOT NULL,
    is_primary   BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order   INTEGER      NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Services de la résidence (piscine, parking, wifi…)
CREATE TABLE residence_services (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    residence_id UUID         NOT NULL REFERENCES residences(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    icon_name    VARCHAR(50),
    UNIQUE (residence_id, service_name)
);

-- ─────────────────────────────────────────────
--  3. APARTMENTS
-- ─────────────────────────────────────────────
CREATE TABLE apartments (
    id               UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
    residence_id     UUID             NOT NULL REFERENCES residences(id) ON DELETE CASCADE,
    apartment_number VARCHAR(20)      NOT NULL,
    floor            INTEGER,
    surface          DECIMAL(8,2),
    rooms            INTEGER          NOT NULL CHECK (rooms >= 0),
    bedrooms         INTEGER          NOT NULL CHECK (bedrooms >= 0),
    bathrooms        INTEGER          NOT NULL DEFAULT 1,
    capacity         INTEGER          NOT NULL CHECK (capacity > 0),
    description      TEXT,
    status           apartment_status NOT NULL DEFAULT 'available',

    price_per_night  DECIMAL(10,2),
    view_type        VARCHAR(100),   -- vue mer, jardin, piscine (pour chatbot IA)
    created_at       TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP        NOT NULL DEFAULT NOW(),
    UNIQUE (residence_id, apartment_number)
);

-- Photos de l'appartement
CREATE TABLE apartment_photos (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_id UUID         NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    photo_url    VARCHAR(500) NOT NULL,
    is_primary   BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order   INTEGER      NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Équipements de l'appartement (climatisation, wifi…)
CREATE TABLE apartment_equipments (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_id UUID         NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    equipment    VARCHAR(100) NOT NULL,
    UNIQUE (apartment_id, equipment)
);

-- ─────────────────────────────────────────────
--  4. PROPRIÉTAIRE ↔ APPARTEMENT
--     Un propriétaire peut posséder plusieurs appartements
-- ─────────────────────────────────────────────
CREATE TABLE owner_apartments (
    id           UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id     UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apartment_id UUID      NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    start_date   DATE,
    end_date     DATE,
    is_active    BOOLEAN   NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (owner_id, apartment_id)
);

-- ─────────────────────────────────────────────
--  5. CHARGES & PAIEMENTS
-- ─────────────────────────────────────────────

CREATE TABLE charges (
    id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    syndic_id    UUID           NOT NULL REFERENCES users(id)     ON DELETE RESTRICT,
    owner_id     UUID           NOT NULL REFERENCES users(id)     ON DELETE RESTRICT,
    apartment_id UUID           NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,

    title        VARCHAR(255)   NOT NULL,
    description  TEXT,
    amount       DECIMAL(10,2)  NOT NULL CHECK (amount > 0),
    due_date     DATE           NOT NULL, --date limite de paiement
    status       payment_status NOT NULL DEFAULT 'pending',
   
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- Validation du paiement (hors ligne, confirmé par le syndic)
CREATE TABLE payments (
    id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    charge_id      UUID         NOT NULL REFERENCES charges(id)  ON DELETE CASCADE,
    validated_by   UUID         NOT NULL REFERENCES users(id)    ON DELETE RESTRICT,

    payment_date   DATE         NOT NULL,
    payment_method VARCHAR(50)  NOT NULL DEFAULT 'cash',
    reference      VARCHAR(100),
    notes          TEXT,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
--  6. RESERVATIONS / RENDEZ-VOUS
--     ★ REFONTE COMPLÈTE :
--       - Plus de table availability_slots
--       - Visiteur SANS compte (nom + email + téléphone seulement)
--       - 3 créneaux fixes : 09:00 | 14:00 | 17:00
--       - UNIQUE (syndic_id, appointment_date, time_slot)
--         → naturellement limité à 3 RDV max/jour/syndic
--         car time_slot n'a que 3 valeurs possibles
-- ─────────────────────────────────────────────
CREATE TABLE reservations (
    id               UUID               PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_id     UUID               NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,
    syndic_id        UUID               NOT NULL REFERENCES users(id)      ON DELETE RESTRICT,

    -- ★ Date choisie + créneau (09:00 / 14:00 / 17:00)
    appointment_date DATE               NOT NULL,
    time_slot        time_slot          NOT NULL,

    status           reservation_status NOT NULL DEFAULT 'pending',

    -- ★ Visiteur SANS authentification
    --   On enregistre juste nom / email / téléphone
    visitor_name     VARCHAR(255)       NOT NULL,
    visitor_email    VARCHAR(255)       NOT NULL,
    visitor_phone    VARCHAR(20),
    message          TEXT,

    -- Dates de séjour souhaitées (optionnel)
    check_in_date    DATE,
    check_out_date   DATE,
    guests_count     INTEGER CHECK (guests_count > 0),

    notes            TEXT,          -- notes internes syndic
    created_at       TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP      NOT NULL DEFAULT NOW(),

    -- ★ Clé UNIQUE = max 3 RDV par jour par syndic
    --   (3 valeurs ENUM × 1 syndic × 1 date = 3 lignes max)
    CONSTRAINT uq_syndic_date_slot
        UNIQUE (syndic_id, appointment_date, time_slot),

    CONSTRAINT valid_stay_dates CHECK (
        check_out_date IS NULL
        OR check_in_date IS NULL
        OR check_out_date > check_in_date
    )
);

COMMENT ON TABLE reservations IS
  '★ 3 créneaux fixes/jour. UNIQUE (syndic_id, date, time_slot) limite à 3 RDV max.';
COMMENT ON COLUMN reservations.visitor_name IS
  '★ Pas besoin de compte — le visiteur remplit juste ce formulaire.';

-- ─────────────────────────────────────────────
--  7. INCIDENTS
-- ─────────────────────────────────────────────
CREATE TABLE incidents (
    id           UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    residence_id UUID              NOT NULL REFERENCES residences(id) ON DELETE CASCADE,
    apartment_id UUID                       REFERENCES apartments(id) ON DELETE SET NULL,
    declared_by  UUID              NOT NULL REFERENCES users(id),
    assigned_to  UUID                       REFERENCES users(id),
  
    title        VARCHAR(255)      NOT NULL,
    description  TEXT              NOT NULL,
    type         VARCHAR(100),
    status       incident_status   NOT NULL DEFAULT 'pending',
    priority     incident_priority NOT NULL DEFAULT 'normal',
    resolved_at  TIMESTAMP,
    created_at   TIMESTAMP         NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP         NOT NULL DEFAULT NOW(),
    UNIQUE (residence_id, apartment_id, declared_by)
);
--incident photos
CREATE TABLE incident_photos (
    id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID         NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,

    photo_url   VARCHAR(500) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
--incident comment
CREATE TABLE incident_comments (
    id          UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID      NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    author_id   UUID      NOT NULL REFERENCES users(id),
    comment     TEXT      NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
--incident history
CREATE TABLE incident_history (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID            NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    changed_by  UUID            NOT NULL REFERENCES users(id),

    old_status  incident_status,
    new_status  incident_status NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
--  8. COMMUNICATION
-- ─────────────────────────────────────────────

CREATE TABLE announcements (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    syndic_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    residence_id UUID         NOT NULL REFERENCES residences(id) ON DELETE CASCADE,
    
    title        VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,
    is_pinned    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id             UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title          VARCHAR(255)      NOT NULL,
    message        TEXT              NOT NULL,
    type           notification_type NOT NULL DEFAULT 'general',
    reference_id   UUID,
    reference_type VARCHAR(50),
    is_read        BOOLEAN           NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP         NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
--  9. CHATBOT IA — Historique recherches
-- ─────────────────────────────────────────────
CREATE TABLE search_history (
    id               UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID      REFERENCES users(id) ON DELETE SET NULL,
    session_id       VARCHAR(255),
    query            TEXT      NOT NULL,
    filters_detected JSONB,
    results_count    INTEGER   DEFAULT 0,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
--  10. INDEX — Performance
-- ─────────────────────────────────────────────
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_role         ON users(role);

CREATE INDEX idx_res_syndic         ON residences(syndic_id);
CREATE INDEX idx_res_city           ON residences(city);
CREATE INDEX idx_res_active         ON residences(is_active);

CREATE INDEX idx_apt_residence      ON apartments(residence_id);
CREATE INDEX idx_apt_status         ON apartments(status);
CREATE INDEX idx_apt_capacity       ON apartments(capacity);
CREATE INDEX idx_apt_view           ON apartments(view_type);

CREATE INDEX idx_oa_owner           ON owner_apartments(owner_id);
CREATE INDEX idx_oa_apartment       ON owner_apartments(apartment_id);

CREATE INDEX idx_chg_owner          ON charges(owner_id);
CREATE INDEX idx_chg_apartment      ON charges(apartment_id);  -- ★
CREATE INDEX idx_chg_status         ON charges(status);
CREATE INDEX idx_chg_due            ON charges(due_date);
CREATE INDEX idx_pay_charge         ON payments(charge_id);
-- ★ Index sur (syndic, date) pour le calcul des jours disponibles
CREATE INDEX idx_rdv_syndic_date    ON reservations(syndic_id, appointment_date);
CREATE INDEX idx_rdv_status         ON reservations(status);
CREATE INDEX idx_rdv_email          ON reservations(visitor_email);

CREATE INDEX idx_inc_residence      ON incidents(residence_id);
CREATE INDEX idx_inc_status         ON incidents(status);

CREATE INDEX idx_notif_user         ON notifications(user_id);
CREATE INDEX idx_notif_read         ON notifications(is_read);

-- ─────────────────────────────────────────────
--  11. TRIGGERS
-- ─────────────────────────────────────────────

-- updated_at automatique
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------
CREATE TRIGGER trg_users_upd
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_residences_upd
    BEFORE UPDATE ON residences
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_apartments_upd
    BEFORE UPDATE ON apartments
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_charges_upd
    BEFORE UPDATE ON charges
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_incidents_upd
    BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_announcements_upd
    BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_reservations_upd
    BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Historique automatique des changements de statut incident
CREATE OR REPLACE FUNCTION fn_log_incident_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO incident_history (incident_id, changed_by, old_status, new_status)
        VALUES (NEW.id, COALESCE(NEW.assigned_to, NEW.declared_by), 
        OLD.status, NEW.status);
        IF NEW.status = 'resolved' THEN
            NEW.resolved_at = NOW();
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incident_log
    BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION fn_log_incident_change();

-- ★ Protection supplémentaire : max 3 RDV non annulés par jour par syndic
--   La contrainte UNIQUE gère déjà les doublons de créneaux,
--   ce trigger gère le cas où un créneau annulé libère la place
CREATE OR REPLACE FUNCTION fn_check_rdv_limit()
RETURNS TRIGGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    IF NEW.status = 'cancelled' THEN
        RETURN NEW;  -- annulation toujours autorisée
    END IF;

    SELECT COUNT(*) INTO v_count
    FROM   reservations
    WHERE  syndic_id        = NEW.syndic_id
      AND  appointment_date = NEW.appointment_date
      AND  status           <> 'cancelled'
      AND  id               IS DISTINCT FROM NEW.id;

    IF v_count >= 3 THEN
        RAISE EXCEPTION
            'Journée complète : 3 rendez-vous déjà pris le % pour ce syndic.',
            NEW.appointment_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rdv_limit
    BEFORE INSERT OR UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION fn_check_rdv_limit();

-- ─────────────────────────────────────────────
--  12. VUES — Calendrier & Dashboard
-- ─────────────────────────────────────────────

-- ★ VUE : jours disponibles pour un syndic
--   Utilisée par le frontend pour griser les jours complets
--   Retourne uniquement les dates avec au moins 1 créneau libre
--
--   Usage API : GET /syndic/:id/jours-disponibles
--   Requête   : SELECT * FROM v_available_days WHERE syndic_id = $1
CREATE VIEW v_available_days AS
SELECT
    syndic_id,
    appointment_date,
    COUNT(*)      FILTER (WHERE status <> 'cancelled') AS booked_count,
    3 - COUNT(*)  FILTER (WHERE status <> 'cancelled') AS slots_remaining,

    -- Tableau des créneaux déjà pris
    ARRAY_AGG(time_slot::text)
        FILTER (WHERE status <> 'cancelled')           AS booked_slots
FROM reservations
WHERE appointment_date >= CURRENT_DATE
GROUP BY syndic_id, appointment_date
HAVING COUNT(*) FILTER (WHERE status <> 'cancelled') < 3;

COMMENT ON VIEW v_available_days IS
  '★ Jours avec au moins 1 créneau libre. Calendrier frontend : griser les jours absents.';

-- ★ VUE : créneaux disponibles pour une date et un syndic
--   Utilisée après que le visiteur a choisi un jour
--
--   Usage API : GET /syndic/:id/creneaux?date=2024-08-05
--   Requête   : SELECT * FROM v_slots_by_day
--               WHERE syndic_id = $1 AND slot_date = $2
CREATE VIEW v_slots_by_day AS
WITH all_slots AS (
    SELECT unnest(ARRAY['09:00','14:00','17:00']::time_slot[]) AS slot
),
taken AS (
    SELECT time_slot, appointment_date, syndic_id
    FROM   reservations
    WHERE  status <> 'cancelled'
)
SELECT
    r.syndic_id,
    r.appointment_date             AS slot_date,
    s.slot                         AS time_slot,
    (t.time_slot IS NULL)          AS is_available
FROM (
    SELECT DISTINCT syndic_id, appointment_date
    FROM   reservations
    WHERE  appointment_date >= CURRENT_DATE
) r
CROSS JOIN all_slots s
LEFT  JOIN taken t
    ON  t.syndic_id        = r.syndic_id
    AND t.appointment_date = r.appointment_date
    AND t.time_slot        = s.slot;

COMMENT ON VIEW v_slots_by_day IS
  '★ Les 3 créneaux (09h/14h/17h) avec is_available TRUE/FALSE par jour et syndic.';

-- Appartements disponibles (pour recherche + chatbot IA)
CREATE VIEW v_available_apartments AS
SELECT
    a.id,
    a.apartment_number,
    a.floor,
    a.surface,
    a.rooms,
    a.bedrooms,
    a.bathrooms,
    a.capacity,
    a.description,
    a.status,
    a.price_per_night,
    a.view_type,
    r.id          AS residence_id,
    r.name        AS residence_name,
    r.city,
    r.address,
    r.latitude,
    r.longitude,

    (SELECT photo_url
     FROM   apartment_photos
     WHERE  apartment_id = a.id AND is_primary = TRUE  LIMIT  1)     
                                    AS primary_photo,

    (SELECT COALESCE(json_agg(equipment), '[]'::json)
     FROM   apartment_equipments
     WHERE  apartment_id = a.id)                  AS equipments,
    
    (SELECT COALESCE(json_agg(service_name), '[]'::json)
     FROM   residence_services
     WHERE  residence_id = r.id)                  AS residence_services

FROM apartments a
JOIN residences r ON r.id = a.residence_id
WHERE a.status = 'available'
  AND r.is_active = TRUE;

-- Dashboard Syndic
CREATE VIEW v_dashboard_syndic AS
SELECT
    u.id                                                                AS syndic_id,
    u.first_name || ' ' || u.last_name                                 AS syndic_name,
    COUNT(DISTINCT re.id)                                              AS total_residences,
    COUNT(DISTINCT a.id)                                               AS total_apartments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'available')        AS available_apartments,
    COUNT(DISTINCT oa.owner_id)                                        AS total_owners,
    COUNT(DISTINCT c.id)  FILTER (WHERE c.status = 'pending')         AS pending_charges,
    COALESCE(SUM(c.amount) FILTER (WHERE c.status = 'pending'), 0)    AS pending_amount,
    COUNT(DISTINCT i.id)  FILTER (WHERE i.status <> 'resolved')       AS open_incidents,
    COUNT(DISTINCT rv.id) FILTER (WHERE rv.status = 'pending')        AS pending_reservations,
    COUNT(DISTINCT rv.id) FILTER (
        WHERE rv.status = 'pending'
          AND rv.appointment_date = CURRENT_DATE)                      AS todays_rdv
FROM  users              u
LEFT  JOIN residences    re ON re.syndic_id    = u.id
LEFT  JOIN apartments    a  ON a.residence_id  = re.id
LEFT  JOIN owner_apartments oa ON oa.apartment_id = a.id AND oa.is_active = TRUE
LEFT  JOIN charges       c  ON c.syndic_id     = u.id
LEFT  JOIN incidents     i  ON i.residence_id  = re.id
LEFT  JOIN reservations  rv ON rv.syndic_id    = u.id
WHERE u.role = 'syndic'
GROUP BY u.id, u.first_name, u.last_name;

-- Dashboard Admin
CREATE VIEW v_dashboard_admin AS
SELECT
    COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'syndic')             AS total_syndics,
    COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'owner')              AS total_owners,
    COUNT(DISTINCT rv.visitor_email)                                    AS total_visitors,
    COUNT(DISTINCT r.id)                                               AS total_residences,
    COUNT(DISTINCT a.id)                                               AS total_apartments,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'available')        AS available_apartments,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status <> 'resolved')        AS open_incidents,
    COUNT(DISTINCT rv.id) FILTER (WHERE rv.status = 'pending')        AS pending_reservations
FROM  users           u
LEFT  JOIN residences r  ON r.syndic_id    = u.id
LEFT  JOIN apartments a  ON a.residence_id = r.id
LEFT  JOIN incidents  i  ON i.residence_id = r.id
LEFT  JOIN reservations rv ON rv.apartment_id = a.id;

-- ─────────────────────────────────────────────
--  13. SEED — Compte admin par défaut
--      Mot de passe : Admin@1234
--      ⚠ À changer immédiatement en production
-- ─────────────────────────────────────────────
INSERT INTO users (email, password, first_name, last_name, role)
VALUES (
    'admin@smartsyndic.ma',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMUdfufF.xUMH7sJAVsS9VJDBC',
    'Super',
    'Admin',
    'admin'
);