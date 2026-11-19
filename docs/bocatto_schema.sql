-- Bocatto — estrutura do banco (somente schema, sem dados nem credenciais).
-- Gerado a partir do banco migrado com:
--   pg_dump --schema-only --no-owner --no-privileges --no-comments
-- A FONTE OFICIAL da estrutura são as migrations (api-bocatto/migrations/).
-- Este arquivo é só para consulta: não use para criar o banco.

--
-- PostgreSQL database dump
--


-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeData; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeData" (
    name character varying(255) NOT NULL
);


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nome character varying(60) NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: enderecos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enderecos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    rua character varying(150) NOT NULL,
    numero character varying(20) NOT NULL,
    complemento character varying(100),
    bairro character varying(100) NOT NULL,
    cidade character varying(100) NOT NULL,
    cep character varying(8) NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    apelido character varying(40)
);


--
-- Name: enderecos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enderecos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enderecos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enderecos_id_seq OWNED BY public.enderecos.id;


--
-- Name: pedido_itens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedido_itens (
    id integer NOT NULL,
    pedido_id integer NOT NULL,
    produto_id integer NOT NULL,
    nome_produto character varying(120) NOT NULL,
    preco_unitario numeric(10,2) NOT NULL,
    quantidade integer NOT NULL,
    CONSTRAINT ck_pedido_itens_preco CHECK ((preco_unitario > (0)::numeric)),
    CONSTRAINT ck_pedido_itens_quantidade CHECK ((quantidade > 0))
);


--
-- Name: pedido_itens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedido_itens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedido_itens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedido_itens_id_seq OWNED BY public.pedido_itens.id;


--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    status character varying(30) DEFAULT 'pendente'::character varying NOT NULL,
    endereco_rua character varying(150) NOT NULL,
    endereco_numero character varying(20) NOT NULL,
    endereco_complemento character varying(100),
    endereco_bairro character varying(100) NOT NULL,
    endereco_cidade character varying(100) NOT NULL,
    endereco_cep character varying(8) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    taxa_entrega numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_pedidos_status CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'em_preparo'::character varying, 'saiu_para_entrega'::character varying, 'entregue'::character varying, 'cancelado'::character varying])::text[]))),
    CONSTRAINT ck_pedidos_valores CHECK (((subtotal >= (0)::numeric) AND (taxa_entrega >= (0)::numeric) AND (total = (subtotal + taxa_entrega))))
);


--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- Name: produtos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    categoria_id integer NOT NULL,
    nome character varying(120) NOT NULL,
    descricao text,
    preco numeric(10,2) NOT NULL,
    imagem_url character varying(500),
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_produtos_preco CHECK ((preco > (0)::numeric))
);


--
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(120) NOT NULL,
    email character varying(254) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    perfil character varying(20) DEFAULT 'cliente'::character varying NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_usuarios_perfil CHECK (((perfil)::text = ANY ((ARRAY['cliente'::character varying, 'admin'::character varying])::text[])))
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: enderecos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enderecos ALTER COLUMN id SET DEFAULT nextval('public.enderecos_id_seq'::regclass);


--
-- Name: pedido_itens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens ALTER COLUMN id SET DEFAULT nextval('public.pedido_itens_id_seq'::regclass);


--
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: SequelizeData SequelizeData_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeData"
    ADD CONSTRAINT "SequelizeData_pkey" PRIMARY KEY (name);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: categorias categorias_nome_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_nome_key UNIQUE (nome);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: enderecos enderecos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_pkey PRIMARY KEY (id);


--
-- Name: pedido_itens pedido_itens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- Name: pedido_itens uq_pedido_itens_produto; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT uq_pedido_itens_produto UNIQUE (pedido_id, produto_id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: ix_enderecos_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_enderecos_usuario ON public.enderecos USING btree (usuario_id);


--
-- Name: ix_pedido_itens_produto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_pedido_itens_produto ON public.pedido_itens USING btree (produto_id);


--
-- Name: ix_pedidos_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_pedidos_status ON public.pedidos USING btree (status);


--
-- Name: ix_pedidos_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_pedidos_usuario ON public.pedidos USING btree (usuario_id);


--
-- Name: ix_produtos_categoria; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_produtos_categoria ON public.produtos USING btree (categoria_id);


--
-- Name: enderecos enderecos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enderecos
    ADD CONSTRAINT enderecos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: pedido_itens pedido_itens_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- Name: pedido_itens pedido_itens_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido_itens
    ADD CONSTRAINT pedido_itens_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE RESTRICT;


--
-- Name: pedidos pedidos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- Name: produtos produtos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--


