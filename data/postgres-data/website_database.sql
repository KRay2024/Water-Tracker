PGDMP                      }           website_data    17.4    17.4 (Homebrew)                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            !           1262    16384    website_data    DATABASE     n   CREATE DATABASE website_data WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE website_data;
                     postgres    false            �            1259    16424    drinking    TABLE     �   CREATE TABLE public.drinking (
    id integer NOT NULL,
    user_id integer,
    oz_goal integer,
    oz_consumed integer,
    oz_remaining integer GENERATED ALWAYS AS ((oz_goal - oz_consumed)) STORED,
    date date
);
    DROP TABLE public.drinking;
       public         heap r       pg_database_owner    false            �            1259    16423    drinking_id_seq    SEQUENCE     �   CREATE SEQUENCE public.drinking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.drinking_id_seq;
       public               pg_database_owner    false    220            "           0    0    drinking_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.drinking_id_seq OWNED BY public.drinking.id;
          public               pg_database_owner    false    219            �            1259    16417    users    TABLE     �   CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(60),
    email character varying(60),
    age integer
);
    DROP TABLE public.users;
       public         heap r       pg_database_owner    false            �            1259    16416    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public               pg_database_owner    false    218            #           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public               pg_database_owner    false    217            �           2604    16427    drinking id    DEFAULT     j   ALTER TABLE ONLY public.drinking ALTER COLUMN id SET DEFAULT nextval('public.drinking_id_seq'::regclass);
 :   ALTER TABLE public.drinking ALTER COLUMN id DROP DEFAULT;
       public               pg_database_owner    false    220    219    220                       2604    16420    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               pg_database_owner    false    218    217    218                      0    16424    drinking 
   TABLE DATA           K   COPY public.drinking (id, user_id, oz_goal, oz_consumed, date) FROM stdin;
    public               pg_database_owner    false    220   �                 0    16417    users 
   TABLE DATA           :   COPY public.users (user_id, name, email, age) FROM stdin;
    public               pg_database_owner    false    218   �       $           0    0    drinking_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.drinking_id_seq', 1, true);
          public               pg_database_owner    false    219            %           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);
          public               pg_database_owner    false    217            �           2606    16430    drinking drinking_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.drinking
    ADD CONSTRAINT drinking_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.drinking DROP CONSTRAINT drinking_pkey;
       public                 pg_database_owner    false    220            �           2606    16422    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 pg_database_owner    false    218            �           2606    16431    drinking drinking_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.drinking
    ADD CONSTRAINT drinking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 H   ALTER TABLE ONLY public.drinking DROP CONSTRAINT drinking_user_id_fkey;
       public               pg_database_owner    false    3459    218    220               "   x�3�4�46�44�4202�50�52����� 5��         +   x�3��N�IM����E���I��9�Ez�)��F�\1z\\\ �S     