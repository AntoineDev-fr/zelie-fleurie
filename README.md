# Zélie Fleurie

Site e-commerce développé pour **Zélie Fleurie**, fleuriste à Rouen.

Le projet permet de présenter l'activité de la boutique, vendre des créations florales en ligne et proposer la réservation d'ateliers.

## Fonctionnalités

### Boutique

- Catalogue de produits
- Catégories de produits
- Variantes et tailles de bouquets
- Gestion du stock
- Panier
- Achat sans création de compte
- Message personnalisé pour les bouquets
- Paiement en ligne avec Stripe

### Livraison & retrait

- Click & Collect
- Livraison à vélo
- Calcul des frais de livraison selon la distance
- Sélection d'une date ou d'un créneau
- Suivi du statut des commandes

### Ateliers

- Présentation des ateliers
- Gestion des créneaux
- Nombre de places disponibles
- Réservation de plusieurs places
- Paiement en ligne
- Gestion des annulations et remboursements

### Abonnements floraux

- Présentation des différentes formules
- Informations et tarifs
- Souscription directement auprès de la boutique

### Mariages & événements

- Présentation des prestations
- Formulaire de demande de devis

### Administration

Un espace d'administration permet à la fleuriste de gérer :

- les produits ;
- les catégories ;
- les stocks ;
- les commandes ;
- les statuts des commandes ;
- les ateliers ;
- les créneaux ;
- les demandes de devis.

### Emails

Envoi automatique d'emails pour les principaux événements :

- confirmation de commande ;
- confirmation de réservation d'un atelier ;
- notification de nouvelle commande à la boutique ;
- informations liées au suivi des commandes.

---

## Stack technique

### Back-end

- Python
- Django
- Gunicorn

### Front-end

- Django Templates
- HTML
- CSS
- JavaScript

### Base de données

- PostgreSQL

### Paiement

- Stripe

### Infrastructure

- Docker
- Docker Compose
- Nginx
- VPS

---

## Architecture

```text
Internet
   │
   │ HTTPS
   ▼
 Nginx
   │
   ▼
Django / Gunicorn
   │
   ▼
PostgreSQL
```

Le projet utilise une architecture Django monolithique.

Le front-end est rendu côté serveur avec les templates Django.  
Django gère également la logique métier, les commandes, le catalogue, les ateliers et les interactions avec PostgreSQL.

---

## Structure du projet

```text
zelie-fleurie/
│
├── config/             # Configuration Django
├── core/               # Pages générales
├── catalog/            # Catalogue et produits
├── cart/               # Panier
├── orders/             # Commandes, paiement et livraison
├── workshops/          # Ateliers
├── subscriptions/      # Abonnements floraux
├── quotes/             # Demandes de devis
├── dashboard/          # Back-office
│
├── templates/          # Templates globaux
├── static/             # CSS, JavaScript et assets
├── media/              # Fichiers uploadés
│
├── nginx/              # Configuration Nginx
├── scripts/            # Scripts de déploiement / sauvegarde
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── manage.py
```

---

## Installation

### 1. Cloner le projet

```bash
git clone <URL_DU_REPOSITORY>
cd zelie-fleurie
```

### 2. Créer l'environnement virtuel

```bash
python -m venv .venv
```

Windows :

```bash
.venv\Scripts\activate
```

Linux / macOS :

```bash
source .venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Variables d'environnement

Créer un fichier `.env` à partir de :

```text
.env.example
```

Les secrets et identifiants ne doivent jamais être commit sur Git.

### 5. Migrations

```bash
python manage.py migrate
```

### 6. Lancer le serveur de développement

```bash
python manage.py runserver
```

Le site est alors disponible localement sur le port `8000`.

---

## Environnements

Le projet distingue :

- développement local ;
- production.

La production utilise Docker Compose avec :

```text
nginx
web (Django + Gunicorn)
db (PostgreSQL)
```

---

## Sécurité

Le projet prévoit notamment :

- HTTPS ;
- secrets stockés dans les variables d'environnement ;
- `DEBUG=False` en production ;
- protection CSRF Django ;
- sécurisation des cookies ;
- base PostgreSQL non exposée publiquement ;
- paiement délégué à Stripe ;
- sauvegardes régulières de la base de données et des médias.

Aucune donnée bancaire n'est stockée par l'application.

---

## Statut

Projet en cours de développement.

### Roadmap

- [ ] Initialisation Django
- [ ] Configuration PostgreSQL
- [ ] Intégration de la maquette
- [ ] Modèles de données
- [ ] Catalogue
- [ ] Panier
- [ ] Checkout
- [ ] Click & Collect
- [ ] Livraison
- [ ] Stripe
- [ ] Ateliers
- [ ] Abonnements floraux
- [ ] Demandes de devis
- [ ] Dashboard
- [ ] Emails transactionnels
- [ ] Tests
- [ ] Dockerisation
- [ ] Déploiement

---

## Développeur

Projet conçu et développé par **Antoine**.
