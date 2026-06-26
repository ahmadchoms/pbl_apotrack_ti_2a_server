


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "action" character varying(50) NOT NULL,
    "description" "text" NOT NULL,
    "status" character varying(20) DEFAULT 'SUCCESS'::character varying NOT NULL,
    "metadata" json,
    "created_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cache" (
    "key" character varying(255) NOT NULL,
    "value" "text" NOT NULL,
    "expiration" integer NOT NULL
);


ALTER TABLE "public"."cache" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cache_locks" (
    "key" character varying(255) NOT NULL,
    "owner" character varying(255) NOT NULL,
    "expiration" integer NOT NULL
);


ALTER TABLE "public"."cache_locks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" NOT NULL,
    "cart_id" "uuid" NOT NULL,
    "medicine_id" "uuid" NOT NULL,
    "quantity" integer NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."delivery_trackings" (
    "id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "tracking_number" character varying(50),
    "status" character varying(30) DEFAULT 'confirmed'::character varying NOT NULL,
    "delivery_fee" numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone,
    "biteship_order_id" character varying(100),
    "biteship_tracking_id" character varying(100),
    "tracking_link" "text",
    "courier" "jsonb",
    "origin" "jsonb",
    "destination" "jsonb",
    "history" "jsonb" DEFAULT '[]'::"jsonb"
);


ALTER TABLE "public"."delivery_trackings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."failed_jobs" (
    "id" bigint NOT NULL,
    "uuid" character varying(255) NOT NULL,
    "connection" "text" NOT NULL,
    "queue" "text" NOT NULL,
    "payload" "text" NOT NULL,
    "exception" "text" NOT NULL,
    "failed_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."failed_jobs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."failed_jobs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."failed_jobs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."failed_jobs_id_seq" OWNED BY "public"."failed_jobs"."id";



CREATE TABLE IF NOT EXISTS "public"."job_batches" (
    "id" character varying(255) NOT NULL,
    "name" character varying(255) NOT NULL,
    "total_jobs" integer NOT NULL,
    "pending_jobs" integer NOT NULL,
    "failed_jobs" integer NOT NULL,
    "failed_job_ids" "text" NOT NULL,
    "options" "text",
    "cancelled_at" integer,
    "created_at" integer NOT NULL,
    "finished_at" integer
);


ALTER TABLE "public"."job_batches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" bigint NOT NULL,
    "queue" character varying(255) NOT NULL,
    "payload" "text" NOT NULL,
    "attempts" smallint NOT NULL,
    "reserved_at" integer,
    "available_at" integer NOT NULL,
    "created_at" integer NOT NULL
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."jobs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."jobs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."jobs_id_seq" OWNED BY "public"."jobs"."id";



CREATE TABLE IF NOT EXISTS "public"."medicine_batches" (
    "id" "uuid" NOT NULL,
    "medicine_id" "uuid" NOT NULL,
    "batch_number" character varying(50) NOT NULL,
    "expired_date" "date" NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "deleted_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone,
    CONSTRAINT "chk_stock_non_negative" CHECK (("stock" >= 0))
);


ALTER TABLE "public"."medicine_batches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."medicine_categories" (
    "id" "uuid" NOT NULL,
    "name" character varying(100) NOT NULL
);


ALTER TABLE "public"."medicine_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."medicine_forms" (
    "id" "uuid" NOT NULL,
    "name" character varying(50) NOT NULL
);


ALTER TABLE "public"."medicine_forms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."medicine_types" (
    "id" "uuid" NOT NULL,
    "name" character varying(50) NOT NULL
);


ALTER TABLE "public"."medicine_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."medicine_units" (
    "id" "uuid" NOT NULL,
    "name" character varying(30) NOT NULL
);


ALTER TABLE "public"."medicine_units" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."medicines" (
    "id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "form_id" "uuid" NOT NULL,
    "type_id" "uuid" NOT NULL,
    "unit_id" "uuid" NOT NULL,
    "name" character varying(200) NOT NULL,
    "generic_name" character varying(200),
    "manufacturer" character varying(100),
    "description" "text",
    "dosage_info" "text",
    "price" numeric(12,2) NOT NULL,
    "requires_prescription" boolean DEFAULT false NOT NULL,
    "weight_in_grams" integer DEFAULT 100 NOT NULL,
    "image_url" character varying(255),
    "is_active" boolean DEFAULT true NOT NULL,
    "deleted_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."medicines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."migrations" (
    "id" integer NOT NULL,
    "migration" character varying(255) NOT NULL,
    "batch" integer NOT NULL
);


ALTER TABLE "public"."migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."migrations_id_seq" OWNED BY "public"."migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" character varying(200) NOT NULL,
    "message" "text" NOT NULL,
    "type" character varying(30),
    "reference_type" character varying(30),
    "reference_id" "uuid",
    "is_read" boolean DEFAULT false NOT NULL,
    "read_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "medicine_id" "uuid" NOT NULL,
    "medicine_name" character varying(200) NOT NULL,
    "unit_name" character varying(30) NOT NULL,
    "requires_prescription" boolean DEFAULT false NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric(12,2) NOT NULL,
    "subtotal" numeric(12,2) NOT NULL,
    CONSTRAINT "chk_quantity_positive" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_status_logs" (
    "id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "status" character varying(50) NOT NULL,
    "description" "text" NOT NULL,
    "source" character varying(30) NOT NULL,
    "created_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."order_status_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "address_id" "uuid",
    "prescription_id" "uuid",
    "order_number" character varying(30) NOT NULL,
    "verification_code" character varying(10) NOT NULL,
    "service_type" character varying(20) NOT NULL,
    "payment_method" character varying(20) NOT NULL,
    "order_status" character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    "payment_status" character varying(20) DEFAULT 'UNPAID'::character varying NOT NULL,
    "subtotal_amount" numeric(12,2) NOT NULL,
    "shipping_cost" numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    "grand_total" numeric(12,2) NOT NULL,
    "notes" "text",
    "cancellation_reason" "text",
    "distance_km" real,
    "paid_at" timestamp(0) without time zone,
    "expired_at" timestamp(0) without time zone NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone,
    CONSTRAINT "chk_grand_total_non_negative" CHECK (("grand_total" >= (0)::numeric))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."password_reset_tokens" (
    "email" character varying(255) NOT NULL,
    "token" character varying(255) NOT NULL,
    "created_at" timestamp(0) without time zone
);


ALTER TABLE "public"."password_reset_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."personal_access_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tokenable_type" character varying(255) NOT NULL,
    "tokenable_id" "uuid" NOT NULL,
    "name" character varying(255) NOT NULL,
    "token" character varying(64) NOT NULL,
    "abilities" "text",
    "last_used_at" timestamp(0) without time zone,
    "expires_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."personal_access_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pharmacies" (
    "id" "uuid" NOT NULL,
    "name" character varying(150) NOT NULL,
    "address" "text" NOT NULL,
    "phone" character varying(20),
    "logo_url" character varying(255),
    "latitude" real NOT NULL,
    "longitude" real NOT NULL,
    "rating" real DEFAULT '0'::real NOT NULL,
    "verification_status" character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    "total_reviews" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "is_force_closed" boolean DEFAULT false NOT NULL,
    "verified_by" "uuid",
    "verified_at" timestamp(0) without time zone,
    "rejection_reason" "text",
    "deleted_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone,
    CONSTRAINT "chk_pharmacy_rating" CHECK ((("rating" >= (0)::double precision) AND ("rating" <= (5)::double precision)))
);


ALTER TABLE "public"."pharmacies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pharmacy_images" (
    "id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "image_url" character varying(255) NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."pharmacy_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pharmacy_legalities" (
    "id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "sia_number" character varying(100) NOT NULL,
    "sipa_number" character varying(100) NOT NULL,
    "stra_number" character varying(100) NOT NULL,
    "apoteker_nik" character varying(20) NOT NULL,
    "sia_document_url" character varying(255) NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."pharmacy_legalities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pharmacy_operating_hours" (
    "id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "day_of_week" integer NOT NULL,
    "open_time" time(0) without time zone,
    "close_time" time(0) without time zone,
    "is_closed" boolean DEFAULT false NOT NULL,
    "is_24_hours" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."pharmacy_operating_hours" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pharmacy_staffs" (
    "id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" character varying(20) NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "deleted_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."pharmacy_staffs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."prescriptions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "order_id" "uuid",
    "image_url" character varying(255) NOT NULL,
    "doctor_name" character varying(100),
    "patient_name" character varying(100),
    "issued_date" "date",
    "status" character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    "verified_by" "uuid",
    "verified_at" timestamp(0) without time zone,
    "rejection_note" "text",
    "created_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."prescriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "pharmacy_id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "medicine_id" "uuid",
    "rating" integer NOT NULL,
    "comment" "text",
    "is_visible" boolean DEFAULT true NOT NULL,
    "created_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_rating_range" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stock_movements" (
    "id" "uuid" NOT NULL,
    "medicine_id" "uuid" NOT NULL,
    "batch_id" "uuid" NOT NULL,
    "type" character varying(20) NOT NULL,
    "quantity" integer NOT NULL,
    "reference_type" character varying(30),
    "reference_id" "uuid",
    "note" "text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_movement_quantity_positive" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."stock_movements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_addresses" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "label" character varying(50) NOT NULL,
    "address_detail" "text" NOT NULL,
    "latitude" real NOT NULL,
    "longitude" real NOT NULL,
    "is_primary" boolean DEFAULT false NOT NULL,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."user_addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_devices" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "fcm_token" "text" NOT NULL,
    "device_type" character varying(255),
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."user_devices" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_devices_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_devices_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_devices_id_seq" OWNED BY "public"."user_devices"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" character varying(100) NOT NULL,
    "phone" character varying(20),
    "email" character varying(100) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "role" character varying(20) DEFAULT 'USERS'::character varying NOT NULL,
    "avatar_url" character varying(255),
    "is_active" boolean DEFAULT true NOT NULL,
    "deleted_at" timestamp(0) without time zone,
    "created_at" timestamp(0) without time zone,
    "updated_at" timestamp(0) without time zone
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."failed_jobs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."failed_jobs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."jobs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."jobs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_devices" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_devices_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cache_locks"
    ADD CONSTRAINT "cache_locks_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."cache"
    ADD CONSTRAINT "cache_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_medicine_id_unique" UNIQUE ("cart_id", "medicine_id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_unique" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."delivery_trackings"
    ADD CONSTRAINT "delivery_trackings_biteship_order_id_key" UNIQUE ("biteship_order_id");



ALTER TABLE ONLY "public"."delivery_trackings"
    ADD CONSTRAINT "delivery_trackings_biteship_tracking_id_key" UNIQUE ("biteship_tracking_id");



ALTER TABLE ONLY "public"."delivery_trackings"
    ADD CONSTRAINT "delivery_trackings_order_id_unique" UNIQUE ("order_id");



ALTER TABLE ONLY "public"."delivery_trackings"
    ADD CONSTRAINT "delivery_trackings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."failed_jobs"
    ADD CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."failed_jobs"
    ADD CONSTRAINT "failed_jobs_uuid_unique" UNIQUE ("uuid");



ALTER TABLE ONLY "public"."job_batches"
    ADD CONSTRAINT "job_batches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medicine_batches"
    ADD CONSTRAINT "medicine_batches_medicine_id_batch_number_unique" UNIQUE ("medicine_id", "batch_number");



ALTER TABLE ONLY "public"."medicine_batches"
    ADD CONSTRAINT "medicine_batches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medicine_categories"
    ADD CONSTRAINT "medicine_categories_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."medicine_categories"
    ADD CONSTRAINT "medicine_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medicine_forms"
    ADD CONSTRAINT "medicine_forms_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."medicine_forms"
    ADD CONSTRAINT "medicine_forms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medicine_types"
    ADD CONSTRAINT "medicine_types_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."medicine_types"
    ADD CONSTRAINT "medicine_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medicine_units"
    ADD CONSTRAINT "medicine_units_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."medicine_units"
    ADD CONSTRAINT "medicine_units_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medicines"
    ADD CONSTRAINT "medicines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_status_logs"
    ADD CONSTRAINT "order_status_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_unique" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_verification_code_unique" UNIQUE ("verification_code");



ALTER TABLE ONLY "public"."password_reset_tokens"
    ADD CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("email");



ALTER TABLE ONLY "public"."personal_access_tokens"
    ADD CONSTRAINT "personal_access_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personal_access_tokens"
    ADD CONSTRAINT "personal_access_tokens_token_unique" UNIQUE ("token");



ALTER TABLE ONLY "public"."pharmacies"
    ADD CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pharmacy_images"
    ADD CONSTRAINT "pharmacy_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pharmacy_legalities"
    ADD CONSTRAINT "pharmacy_legalities_pharmacy_id_unique" UNIQUE ("pharmacy_id");



ALTER TABLE ONLY "public"."pharmacy_legalities"
    ADD CONSTRAINT "pharmacy_legalities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pharmacy_operating_hours"
    ADD CONSTRAINT "pharmacy_operating_hours_pharmacy_id_day_of_week_unique" UNIQUE ("pharmacy_id", "day_of_week");



ALTER TABLE ONLY "public"."pharmacy_operating_hours"
    ADD CONSTRAINT "pharmacy_operating_hours_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pharmacy_staffs"
    ADD CONSTRAINT "pharmacy_staffs_pharmacy_id_user_id_unique" UNIQUE ("pharmacy_id", "user_id");



ALTER TABLE ONLY "public"."pharmacy_staffs"
    ADD CONSTRAINT "pharmacy_staffs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."prescriptions"
    ADD CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_order_id_medicine_id_unique" UNIQUE ("order_id", "medicine_id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stock_movements"
    ADD CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_addresses"
    ADD CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_devices"
    ADD CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_unique" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "audit_logs_action_status_index" ON "public"."audit_logs" USING "btree" ("action", "status");



CREATE INDEX "audit_logs_created_at_index" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "audit_logs_user_id_action_index" ON "public"."audit_logs" USING "btree" ("user_id", "action");



CREATE INDEX "audit_logs_user_id_created_at_index" ON "public"."audit_logs" USING "btree" ("user_id", "created_at");



CREATE UNIQUE INDEX "idx_user_primary_address" ON "public"."user_addresses" USING "btree" ("user_id") WHERE ("is_primary" = true);



CREATE INDEX "jobs_queue_index" ON "public"."jobs" USING "btree" ("queue");



CREATE INDEX "medicine_batches_expired_date_index" ON "public"."medicine_batches" USING "btree" ("expired_date");



CREATE INDEX "medicines_name_index" ON "public"."medicines" USING "btree" ("name");



CREATE INDEX "medicines_pharmacy_id_is_active_deleted_at_index" ON "public"."medicines" USING "btree" ("pharmacy_id", "is_active", "deleted_at");



CREATE INDEX "medicines_pharmacy_id_is_active_index" ON "public"."medicines" USING "btree" ("pharmacy_id", "is_active");



CREATE INDEX "notifications_user_id_is_read_index" ON "public"."notifications" USING "btree" ("user_id", "is_read");



CREATE INDEX "orders_created_at_index" ON "public"."orders" USING "btree" ("created_at");



CREATE INDEX "orders_order_status_index" ON "public"."orders" USING "btree" ("order_status");



CREATE INDEX "orders_payment_status_index" ON "public"."orders" USING "btree" ("payment_status");



CREATE INDEX "orders_pharmacy_id_order_status_created_at_index" ON "public"."orders" USING "btree" ("pharmacy_id", "order_status", "created_at");



CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "public"."personal_access_tokens" USING "btree" ("tokenable_type", "tokenable_id");



CREATE INDEX "pharmacies_is_active_index" ON "public"."pharmacies" USING "btree" ("is_active");



CREATE INDEX "pharmacies_latitude_longitude_index" ON "public"."pharmacies" USING "btree" ("latitude", "longitude");



CREATE INDEX "pharmacies_verification_status_index" ON "public"."pharmacies" USING "btree" ("verification_status");



CREATE INDEX "pharmacy_images_pharmacy_id_index" ON "public"."pharmacy_images" USING "btree" ("pharmacy_id");



CREATE INDEX "pharmacy_staffs_pharmacy_id_is_active_index" ON "public"."pharmacy_staffs" USING "btree" ("pharmacy_id", "is_active");



CREATE INDEX "pharmacy_staffs_user_id_index" ON "public"."pharmacy_staffs" USING "btree" ("user_id");



CREATE INDEX "prescriptions_status_index" ON "public"."prescriptions" USING "btree" ("status");



CREATE INDEX "reviews_pharmacy_id_rating_index" ON "public"."reviews" USING "btree" ("pharmacy_id", "rating");



CREATE INDEX "user_addresses_user_id_is_primary_index" ON "public"."user_addresses" USING "btree" ("user_id", "is_primary");



CREATE INDEX "users_role_index" ON "public"."users" USING "btree" ("role");



CREATE OR REPLACE TRIGGER "notifications_triggers" AFTER INSERT OR DELETE OR UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_foreign" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_medicine_id_foreign" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."delivery_trackings"
    ADD CONSTRAINT "delivery_trackings_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."medicine_batches"
    ADD CONSTRAINT "medicine_batches_medicine_id_foreign" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id");



ALTER TABLE ONLY "public"."medicines"
    ADD CONSTRAINT "medicines_category_id_foreign" FOREIGN KEY ("category_id") REFERENCES "public"."medicine_categories"("id");



ALTER TABLE ONLY "public"."medicines"
    ADD CONSTRAINT "medicines_form_id_foreign" FOREIGN KEY ("form_id") REFERENCES "public"."medicine_forms"("id");



ALTER TABLE ONLY "public"."medicines"
    ADD CONSTRAINT "medicines_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id");



ALTER TABLE ONLY "public"."medicines"
    ADD CONSTRAINT "medicines_type_id_foreign" FOREIGN KEY ("type_id") REFERENCES "public"."medicine_types"("id");



ALTER TABLE ONLY "public"."medicines"
    ADD CONSTRAINT "medicines_unit_id_foreign" FOREIGN KEY ("unit_id") REFERENCES "public"."medicine_units"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_medicine_id_foreign" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_status_logs"
    ADD CONSTRAINT "order_status_logs_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "public"."user_addresses"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_prescription_id_foreign" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."pharmacies"
    ADD CONSTRAINT "pharmacies_verified_by_foreign" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."pharmacy_images"
    ADD CONSTRAINT "pharmacy_images_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pharmacy_legalities"
    ADD CONSTRAINT "pharmacy_legalities_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pharmacy_operating_hours"
    ADD CONSTRAINT "pharmacy_operating_hours_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pharmacy_staffs"
    ADD CONSTRAINT "pharmacy_staffs_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id");



ALTER TABLE ONLY "public"."pharmacy_staffs"
    ADD CONSTRAINT "pharmacy_staffs_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."prescriptions"
    ADD CONSTRAINT "prescriptions_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."prescriptions"
    ADD CONSTRAINT "prescriptions_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."prescriptions"
    ADD CONSTRAINT "prescriptions_verified_by_foreign" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_medicine_id_foreign" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pharmacy_id_foreign" FOREIGN KEY ("pharmacy_id") REFERENCES "public"."pharmacies"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."stock_movements"
    ADD CONSTRAINT "stock_movements_batch_id_foreign" FOREIGN KEY ("batch_id") REFERENCES "public"."medicine_batches"("id");



ALTER TABLE ONLY "public"."stock_movements"
    ADD CONSTRAINT "stock_movements_created_by_foreign" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."stock_movements"
    ADD CONSTRAINT "stock_movements_medicine_id_foreign" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id");



ALTER TABLE ONLY "public"."user_addresses"
    ADD CONSTRAINT "user_addresses_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_devices"
    ADD CONSTRAINT "user_devices_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





























































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."cache" TO "anon";
GRANT ALL ON TABLE "public"."cache" TO "authenticated";
GRANT ALL ON TABLE "public"."cache" TO "service_role";



GRANT ALL ON TABLE "public"."cache_locks" TO "anon";
GRANT ALL ON TABLE "public"."cache_locks" TO "authenticated";
GRANT ALL ON TABLE "public"."cache_locks" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."carts" TO "anon";
GRANT ALL ON TABLE "public"."carts" TO "authenticated";
GRANT ALL ON TABLE "public"."carts" TO "service_role";



GRANT ALL ON TABLE "public"."delivery_trackings" TO "anon";
GRANT ALL ON TABLE "public"."delivery_trackings" TO "authenticated";
GRANT ALL ON TABLE "public"."delivery_trackings" TO "service_role";



GRANT ALL ON TABLE "public"."failed_jobs" TO "anon";
GRANT ALL ON TABLE "public"."failed_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."failed_jobs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."failed_jobs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."failed_jobs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."failed_jobs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."job_batches" TO "anon";
GRANT ALL ON TABLE "public"."job_batches" TO "authenticated";
GRANT ALL ON TABLE "public"."job_batches" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."medicine_batches" TO "anon";
GRANT ALL ON TABLE "public"."medicine_batches" TO "authenticated";
GRANT ALL ON TABLE "public"."medicine_batches" TO "service_role";



GRANT ALL ON TABLE "public"."medicine_categories" TO "anon";
GRANT ALL ON TABLE "public"."medicine_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."medicine_categories" TO "service_role";



GRANT ALL ON TABLE "public"."medicine_forms" TO "anon";
GRANT ALL ON TABLE "public"."medicine_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."medicine_forms" TO "service_role";



GRANT ALL ON TABLE "public"."medicine_types" TO "anon";
GRANT ALL ON TABLE "public"."medicine_types" TO "authenticated";
GRANT ALL ON TABLE "public"."medicine_types" TO "service_role";



GRANT ALL ON TABLE "public"."medicine_units" TO "anon";
GRANT ALL ON TABLE "public"."medicine_units" TO "authenticated";
GRANT ALL ON TABLE "public"."medicine_units" TO "service_role";



GRANT ALL ON TABLE "public"."medicines" TO "anon";
GRANT ALL ON TABLE "public"."medicines" TO "authenticated";
GRANT ALL ON TABLE "public"."medicines" TO "service_role";



GRANT ALL ON TABLE "public"."migrations" TO "anon";
GRANT ALL ON TABLE "public"."migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."migrations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."migrations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."migrations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."migrations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."order_status_logs" TO "anon";
GRANT ALL ON TABLE "public"."order_status_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."order_status_logs" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."password_reset_tokens" TO "anon";
GRANT ALL ON TABLE "public"."password_reset_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."password_reset_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."personal_access_tokens" TO "anon";
GRANT ALL ON TABLE "public"."personal_access_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."personal_access_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."pharmacies" TO "anon";
GRANT ALL ON TABLE "public"."pharmacies" TO "authenticated";
GRANT ALL ON TABLE "public"."pharmacies" TO "service_role";



GRANT ALL ON TABLE "public"."pharmacy_images" TO "anon";
GRANT ALL ON TABLE "public"."pharmacy_images" TO "authenticated";
GRANT ALL ON TABLE "public"."pharmacy_images" TO "service_role";



GRANT ALL ON TABLE "public"."pharmacy_legalities" TO "anon";
GRANT ALL ON TABLE "public"."pharmacy_legalities" TO "authenticated";
GRANT ALL ON TABLE "public"."pharmacy_legalities" TO "service_role";



GRANT ALL ON TABLE "public"."pharmacy_operating_hours" TO "anon";
GRANT ALL ON TABLE "public"."pharmacy_operating_hours" TO "authenticated";
GRANT ALL ON TABLE "public"."pharmacy_operating_hours" TO "service_role";



GRANT ALL ON TABLE "public"."pharmacy_staffs" TO "anon";
GRANT ALL ON TABLE "public"."pharmacy_staffs" TO "authenticated";
GRANT ALL ON TABLE "public"."pharmacy_staffs" TO "service_role";



GRANT ALL ON TABLE "public"."prescriptions" TO "anon";
GRANT ALL ON TABLE "public"."prescriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."prescriptions" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."stock_movements" TO "anon";
GRANT ALL ON TABLE "public"."stock_movements" TO "authenticated";
GRANT ALL ON TABLE "public"."stock_movements" TO "service_role";



GRANT ALL ON TABLE "public"."user_addresses" TO "anon";
GRANT ALL ON TABLE "public"."user_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."user_addresses" TO "service_role";



GRANT ALL ON TABLE "public"."user_devices" TO "anon";
GRANT ALL ON TABLE "public"."user_devices" TO "authenticated";
GRANT ALL ON TABLE "public"."user_devices" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_devices_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_devices_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_devices_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































