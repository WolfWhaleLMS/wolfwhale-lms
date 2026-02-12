'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, ArrowLeft } from 'lucide-react'

type Lang = 'en' | 'fr'

const LAST_UPDATED = '2026-02-10'

const content = {
  en: {
    title: 'Terms of Service',
    subtitle: 'Wolf Whale LMS',
    lastUpdated: `Last updated: ${LAST_UPDATED}`,
    backToHome: 'Back to Home',
    sections: [
      {
        id: 'acceptance-of-terms',
        heading: '1. Acceptance of Terms',
        body: `By accessing or using Wolf Whale LMS ("Wolf Whale," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and Wolf Whale Inc.

You must be authorized by your educational institution to use this platform. If you are a student under the age of majority in your province, your parent or guardian and your school must have authorized your use of the platform. If you do not agree to these Terms, you must not access or use Wolf Whale LMS.

These Terms apply to all users of the platform, including students, teachers, school administrators, and parents or guardians accessing the Parent Portal.`,
      },
      {
        id: 'description-of-services',
        heading: '2. Description of Services',
        body: `Wolf Whale LMS is a Canadian K\u201312 learning management system designed to support the full educational experience. Our platform provides the following services:

\u2022 **Course Management** \u2014 Tools for teachers to create, organize, and deliver course content, assignments, quizzes, and resources
\u2022 **Gradebook** \u2014 A comprehensive grading system with support for weighted categories, custom grading scales, and detailed report cards
\u2022 **Attendance Tracking** \u2014 Digital attendance management with support for present, absent, tardy, and excused statuses
\u2022 **Messaging** \u2014 Secure in-platform messaging between teachers, students, parents, and administrators
\u2022 **Gamification (XP & Badges)** \u2014 An engagement system that rewards students with experience points and badges for academic participation and achievement
\u2022 **Virtual Plaza** \u2014 A safe, moderated social space for students to interact within their school community
\u2022 **Study Tools** \u2014 Built-in flashcards, study mode, and review tools to help students prepare for assessments
\u2022 **Parent Portal** \u2014 A dedicated interface for parents and guardians to monitor grades, attendance, assignments, and communicate with teachers

We continually improve and expand our services. Features may be added, modified, or retired with reasonable notice to school administrators.`,
      },
      {
        id: 'user-accounts',
        heading: '3. User Accounts',
        body: `**Account Creation**
User accounts on Wolf Whale LMS are created by authorized school administrators. Individual users do not self-register. Each account is associated with a specific educational institution and assigned a role (student, teacher, administrator, or parent).

**Account Security**
Users are responsible for maintaining the confidentiality of their login credentials. You must:
\u2022 Keep your password secure and not share it with anyone
\u2022 Log out of shared or public devices after each session
\u2022 Notify your school administrator immediately if you suspect unauthorized access to your account

**Account Restrictions**
\u2022 Users must not share accounts or allow others to use their credentials
\u2022 Users must not create or use multiple accounts without authorization
\u2022 Users must not impersonate another user or misrepresent their identity or role

**Suspension and Termination**
Wolf Whale reserves the right to suspend or terminate user accounts that violate these Terms, engage in prohibited conduct, or pose a security risk to the platform. School administrators may also request the suspension or deactivation of accounts within their institution.`,
      },
      {
        id: 'acceptable-use-policy',
        heading: '4. Acceptable Use Policy',
        body: `Wolf Whale LMS is intended exclusively for educational purposes. All users must use the platform in a manner that is respectful, lawful, and consistent with the educational mission of their institution.

**Prohibited Conduct**
You must not:
\u2022 Use the platform for harassment, bullying, intimidation, or any form of abusive behaviour directed at other users
\u2022 Upload, share, or distribute inappropriate, offensive, obscene, or sexually explicit content
\u2022 Attempt to gain unauthorized access to other users' accounts, school data, or platform systems
\u2022 Share copyrighted material without proper permission or authorization from the rights holder
\u2022 Use the platform for commercial purposes unrelated to education, including advertising, solicitation, or promotion of external products or services
\u2022 Introduce malware, viruses, or other harmful code to the platform
\u2022 Attempt to reverse-engineer, decompile, or extract the source code of the platform
\u2022 Use automated tools, bots, or scripts to access or interact with the platform without authorization

**Enforcement**
Violations of this Acceptable Use Policy may result in warnings, content removal, temporary suspension, or permanent termination of access, at the discretion of Wolf Whale and/or the school administration.`,
      },
      {
        id: 'intellectual-property',
        heading: '5. Intellectual Property',
        body: `**Wolf Whale Property**
Wolf Whale LMS, including its design, source code, user interface, branding, logos, documentation, and all related intellectual property, is the exclusive property of Wolf Whale Inc. All rights are reserved. No part of the platform may be copied, reproduced, distributed, or used without the express written consent of Wolf Whale Inc.

**User-Generated Content**
Content created by users within the platform, including but not limited to assignment submissions, discussion posts, uploaded files, and messages, remains the intellectual property of the user or their educational institution, as applicable.

**Teacher Content**
Teachers retain all intellectual property rights to their course materials, lesson plans, assessments, and other educational content created on or uploaded to the platform. Wolf Whale does not claim ownership of teacher-created content.

**License Grant**
By uploading or creating content on Wolf Whale LMS, you grant Wolf Whale a limited, non-exclusive license to host, store, display, and transmit that content solely for the purpose of providing the educational services described in these Terms. This license terminates when the content is deleted or the account is closed.`,
      },
      {
        id: 'payment-terms',
        heading: '6. Payment Terms',
        body: `**Pricing**
Wolf Whale LMS is offered at a rate of **$12 CAD per user account per month**. This pricing includes full access to all platform features with no additional fees for modules or add-ons.

**Contract Term**
A minimum contract term of **2 years** is required. The contract automatically renews for successive one-year periods unless either party provides written notice of non-renewal at least 90 days before the end of the current term.

**Payment Schedule**
Payment is due annually in advance at the beginning of each contract year. Invoices are issued 30 days before the payment due date. Late payments may be subject to a reasonable administrative fee.

**Price Changes**
Wolf Whale reserves the right to adjust pricing with a minimum of **90 days' written notice** to the contracting school or district. Price changes take effect at the start of the next contract renewal period and do not apply retroactively to the current term.

**Refunds**
Fees are generally non-refundable once paid. In the event of early termination by the school (see Section 11), any unused portion of pre-paid fees will be handled in accordance with the termination provisions of the service agreement.`,
      },
      {
        id: 'data-and-privacy',
        heading: '7. Data and Privacy',
        body: `Wolf Whale is committed to protecting the personal information of all users, particularly students. Our data practices are governed by Canadian privacy law.

**Legal Compliance**
Wolf Whale complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and all applicable provincial privacy legislation, including Quebec's Law 25, British Columbia's FIPPA, Alberta's FOIP Act, and Ontario's MFIPPA.

**Privacy Policy**
For complete details on how we collect, use, store, and protect personal information, please refer to our [Privacy Policy](/privacy). The Privacy Policy is incorporated by reference into these Terms.

**Key Commitments**
\u2022 We do **not** sell user data to any third party, under any circumstances
\u2022 We do **not** use student data for advertising, marketing, or profiling purposes
\u2022 We collect only the minimum personal information necessary to deliver educational services
\u2022 All data is encrypted at rest and in transit
\u2022 We maintain strict access controls and audit logging

**Data Ownership**
Educational data belongs to the students and their institutions. Wolf Whale acts as a data processor on behalf of the school.`,
      },
      {
        id: 'service-availability',
        heading: '8. Service Availability',
        body: `**Uptime Commitment**
Wolf Whale strives to maintain **99.9% platform uptime** across all services. We invest in reliable infrastructure, redundancy, and monitoring to deliver a consistent experience for schools.

**Scheduled Maintenance**
Planned maintenance windows will be communicated to school administrators at least **48 hours in advance** whenever possible. Maintenance is typically scheduled during evenings, weekends, or school holidays to minimize disruption to teaching and learning.

**Unplanned Outages**
In the event of an unplanned service interruption, we will:
\u2022 Work to restore service as quickly as possible
\u2022 Communicate updates to school administrators through email or status page notifications
\u2022 Provide a post-incident summary for significant outages

**Limitation**
Wolf Whale is not liable for service interruptions caused by circumstances beyond our reasonable control, including but not limited to natural disasters, internet outages, third-party service failures, government actions, or cyberattacks. We will, however, take all reasonable steps to restore service promptly.`,
      },
      {
        id: 'disclaimers',
        heading: '9. Disclaimers',
        body: `**"As Is" Provision**
Wolf Whale LMS is provided on an "as is" and "as available" basis. While we strive to deliver a reliable, high-quality platform, we make no warranties or representations, express or implied, regarding the platform's fitness for a particular purpose, merchantability, or uninterrupted availability.

**Educational Outcomes**
Wolf Whale is a tool to support teaching and learning. We do **not** guarantee specific educational outcomes, test scores, grades, or academic results. The effectiveness of the platform depends on how it is used by educators, students, and institutions.

**User-Generated Content**
Wolf Whale is not responsible for the accuracy, legality, or appropriateness of content created or uploaded by users. Schools and users are responsible for the content they publish on the platform. Wolf Whale reserves the right to remove content that violates these Terms or applicable law.

**Third-Party Integrations**
Where the platform integrates with or links to third-party services, Wolf Whale is not responsible for the availability, accuracy, or practices of those third-party services.`,
      },
      {
        id: 'limitation-of-liability',
        heading: '10. Limitation of Liability',
        body: `**Maximum Liability**
To the fullest extent permitted by applicable law, Wolf Whale's total aggregate liability to you or your institution arising out of or related to these Terms or the use of the platform shall not exceed the total fees paid by your institution to Wolf Whale in the **12 months immediately preceding** the event giving rise to the claim.

**Exclusion of Damages**
Wolf Whale shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
\u2022 Loss of data (beyond our obligation to maintain backups as described in our service agreement)
\u2022 Loss of revenue or anticipated savings
\u2022 Loss of goodwill or reputation
\u2022 Business interruption
\u2022 Any damages arising from circumstances beyond our reasonable control

**Exceptions**
Nothing in these Terms excludes or limits liability for:
\u2022 Death or personal injury caused by negligence
\u2022 Fraud or fraudulent misrepresentation
\u2022 Any liability that cannot be excluded or limited under applicable Canadian law`,
      },
      {
        id: 'termination',
        heading: '11. Termination',
        body: `**Termination by Either Party**
Either party may terminate the service agreement by providing **90 days' written notice** to the other party. Notice must be sent to the contact information specified in the service agreement.

**Effect of Termination**
Upon termination of the agreement:
\u2022 School data will be made available for export upon request in standard formats (CSV, JSON, or PDF)
\u2022 The school will have 30 days after the termination effective date to request data export
\u2022 All school data will be permanently deleted from Wolf Whale's systems within **60 days** of the termination effective date, unless the school requests an earlier or later deletion
\u2022 User accounts associated with the institution will be deactivated

**Immediate Termination for Material Breach**
Either party may terminate the agreement immediately upon written notice if the other party commits a material breach that remains uncured for 30 days after written notice of the breach. Material breaches include, but are not limited to:
\u2022 Failure to pay fees when due
\u2022 Violation of data protection or privacy obligations
\u2022 Unauthorized use or distribution of the platform
\u2022 Repeated violations of the Acceptable Use Policy

**Survival**
Provisions relating to intellectual property, limitation of liability, confidentiality, and governing law survive termination of these Terms.`,
      },
      {
        id: 'governing-law',
        heading: '12. Governing Law',
        body: `**Jurisdiction**
These Terms of Service are governed by and construed in accordance with the federal laws of Canada and the laws of the province in which the contracting educational institution is located.

**Dispute Resolution**
Any dispute arising out of or relating to these Terms or the use of Wolf Whale LMS shall be resolved as follows:
\u2022 **Negotiation** \u2014 The parties shall first attempt to resolve the dispute through good-faith negotiation within 30 days of written notice of the dispute
\u2022 **Mediation** \u2014 If negotiation is unsuccessful, the parties shall attempt mediation before a mutually agreed-upon mediator in Canada
\u2022 **Arbitration** \u2014 If mediation is unsuccessful, the dispute shall be submitted to binding arbitration in Canada, conducted in accordance with the applicable provincial arbitration legislation

**Language**
In the event of a conflict between the English and French versions of these Terms, the English version shall prevail, unless the contracting institution is located in Quebec, in which case the French version shall prevail in accordance with Quebec's Charter of the French Language.`,
      },
      {
        id: 'changes-to-terms',
        heading: '13. Changes to Terms',
        body: `**Right to Modify**
Wolf Whale reserves the right to modify, update, or replace these Terms of Service at any time. Changes may be made to reflect new features, legal requirements, or business practices.

**Notice of Changes**
We will provide at least **30 days' written notice** to school administrators before any material changes to these Terms take effect. Notice will be delivered via:
\u2022 Email to the designated school administrator contact
\u2022 A prominent notice within the Wolf Whale LMS platform
\u2022 Updated publication on our website with a revised "Last updated" date

**Acceptance of Changes**
Continued use of Wolf Whale LMS after the effective date of modified Terms constitutes acceptance of the revised Terms. If a school or user does not agree with the changes, they should discontinue use of the platform and contact us to discuss their concerns or initiate termination under Section 11.

**Previous Versions**
Previous versions of these Terms are available upon request by contacting legal@wolfwhale.ca.`,
      },
      {
        id: 'contact',
        heading: '14. Contact',
        body: `If you have questions, concerns, or inquiries regarding these Terms of Service, please contact us:

**Legal Inquiries**
Wolf Whale Inc.
Email: legal@wolfwhale.ca

**General Inquiries**
Wolf Whale LMS
Email: info@wolfwhale.ca
Phone: +1 (306) 981-5926

**Response Times**
\u2022 Legal inquiries: within 10 business days
\u2022 General inquiries: within 5 business days
\u2022 Urgent matters: within 48 hours

We are committed to addressing all inquiries in a timely and professional manner.`,
      },
    ],
  },
  fr: {
    title: 'Conditions d\u2019utilisation',
    subtitle: 'Wolf Whale LMS',
    lastUpdated: `Derni\u00e8re mise \u00e0 jour\u00a0: ${LAST_UPDATED}`,
    backToHome: 'Retour \u00e0 l\u2019accueil',
    sections: [
      {
        id: 'acceptance-of-terms',
        heading: '1. Acceptation des conditions',
        body: `En acc\u00e9dant \u00e0 Wolf Whale LMS (\u00ab\u00a0Wolf Whale\u00a0\u00bb, \u00ab\u00a0nous\u00a0\u00bb ou \u00ab\u00a0notre\u00a0\u00bb) ou en l\u2019utilisant, vous acceptez d\u2019\u00eatre li\u00e9 par les pr\u00e9sentes Conditions d\u2019utilisation (\u00ab\u00a0Conditions\u00a0\u00bb). Ces Conditions constituent un accord juridiquement contraignant entre vous et Wolf Whale Inc.

Vous devez \u00eatre autoris\u00e9 par votre \u00e9tablissement d\u2019enseignement pour utiliser cette plateforme. Si vous \u00eates un \u00e9l\u00e8ve mineur dans votre province, votre parent ou tuteur et votre \u00e9cole doivent avoir autoris\u00e9 votre utilisation de la plateforme. Si vous n\u2019acceptez pas ces Conditions, vous ne devez pas acc\u00e9der \u00e0 Wolf Whale LMS ni l\u2019utiliser.

Ces Conditions s\u2019appliquent \u00e0 tous les utilisateurs de la plateforme, y compris les \u00e9l\u00e8ves, les enseignants, les administrateurs scolaires et les parents ou tuteurs acc\u00e9dant au Portail des parents.`,
      },
      {
        id: 'description-of-services',
        heading: '2. Description des services',
        body: `Wolf Whale LMS est un syst\u00e8me de gestion de l\u2019apprentissage canadien con\u00e7u pour les \u00e9coles de la maternelle \u00e0 la 12e ann\u00e9e, destin\u00e9 \u00e0 soutenir l\u2019exp\u00e9rience \u00e9ducative compl\u00e8te. Notre plateforme offre les services suivants\u00a0:

\u2022 **Gestion des cours** \u2014 Outils permettant aux enseignants de cr\u00e9er, organiser et diffuser du contenu de cours, des devoirs, des questionnaires et des ressources
\u2022 **Carnet de notes** \u2014 Un syst\u00e8me de notation complet avec prise en charge des cat\u00e9gories pond\u00e9r\u00e9es, des \u00e9chelles de notation personnalis\u00e9es et des bulletins d\u00e9taill\u00e9s
\u2022 **Suivi des pr\u00e9sences** \u2014 Gestion num\u00e9rique des pr\u00e9sences avec prise en charge des statuts pr\u00e9sent, absent, en retard et motiv\u00e9
\u2022 **Messagerie** \u2014 Messagerie s\u00e9curis\u00e9e au sein de la plateforme entre enseignants, \u00e9l\u00e8ves, parents et administrateurs
\u2022 **Ludification (XP et badges)** \u2014 Un syst\u00e8me d\u2019engagement qui r\u00e9compense les \u00e9l\u00e8ves avec des points d\u2019exp\u00e9rience et des badges pour leur participation et leurs r\u00e9alisations scolaires
\u2022 **Place virtuelle** \u2014 Un espace social s\u00e9curis\u00e9 et mod\u00e9r\u00e9 permettant aux \u00e9l\u00e8ves d\u2019interagir au sein de leur communaut\u00e9 scolaire
\u2022 **Outils d\u2019\u00e9tude** \u2014 Cartes m\u00e9moire int\u00e9gr\u00e9es, mode \u00e9tude et outils de r\u00e9vision pour aider les \u00e9l\u00e8ves \u00e0 se pr\u00e9parer aux \u00e9valuations
\u2022 **Portail des parents** \u2014 Une interface d\u00e9di\u00e9e permettant aux parents et tuteurs de suivre les notes, les pr\u00e9sences, les devoirs et de communiquer avec les enseignants

Nous am\u00e9liorons et \u00e9largissons continuellement nos services. Des fonctionnalit\u00e9s peuvent \u00eatre ajout\u00e9es, modifi\u00e9es ou retir\u00e9es moyennant un pr\u00e9avis raisonnable aux administrateurs scolaires.`,
      },
      {
        id: 'user-accounts',
        heading: '3. Comptes d\u2019utilisateurs',
        body: `**Cr\u00e9ation de comptes**
Les comptes d\u2019utilisateurs sur Wolf Whale LMS sont cr\u00e9\u00e9s par les administrateurs scolaires autoris\u00e9s. Les utilisateurs ne s\u2019inscrivent pas eux-m\u00eames. Chaque compte est associ\u00e9 \u00e0 un \u00e9tablissement d\u2019enseignement sp\u00e9cifique et se voit attribuer un r\u00f4le (\u00e9l\u00e8ve, enseignant, administrateur ou parent).

**S\u00e9curit\u00e9 du compte**
Les utilisateurs sont responsables de la confidentialit\u00e9 de leurs identifiants de connexion. Vous devez\u00a0:
\u2022 Garder votre mot de passe en s\u00e9curit\u00e9 et ne le partager avec personne
\u2022 Vous d\u00e9connecter des appareils partag\u00e9s ou publics apr\u00e8s chaque session
\u2022 Aviser imm\u00e9diatement votre administrateur scolaire si vous soup\u00e7onnez un acc\u00e8s non autoris\u00e9 \u00e0 votre compte

**Restrictions relatives aux comptes**
\u2022 Les utilisateurs ne doivent pas partager leurs comptes ni permettre \u00e0 d\u2019autres d\u2019utiliser leurs identifiants
\u2022 Les utilisateurs ne doivent pas cr\u00e9er ni utiliser plusieurs comptes sans autorisation
\u2022 Les utilisateurs ne doivent pas usurper l\u2019identit\u00e9 d\u2019un autre utilisateur ni faussement repr\u00e9senter leur identit\u00e9 ou leur r\u00f4le

**Suspension et r\u00e9siliation**
Wolf Whale se r\u00e9serve le droit de suspendre ou de r\u00e9silier les comptes d\u2019utilisateurs qui enfreignent les pr\u00e9sentes Conditions, adoptent un comportement interdit ou repr\u00e9sentent un risque pour la s\u00e9curit\u00e9 de la plateforme. Les administrateurs scolaires peuvent \u00e9galement demander la suspension ou la d\u00e9sactivation de comptes au sein de leur \u00e9tablissement.`,
      },
      {
        id: 'acceptable-use-policy',
        heading: '4. Politique d\u2019utilisation acceptable',
        body: `Wolf Whale LMS est destin\u00e9 exclusivement \u00e0 des fins \u00e9ducatives. Tous les utilisateurs doivent utiliser la plateforme de mani\u00e8re respectueuse, l\u00e9gale et conforme \u00e0 la mission \u00e9ducative de leur \u00e9tablissement.

**Comportements interdits**
Vous ne devez pas\u00a0:
\u2022 Utiliser la plateforme pour le harc\u00e8lement, l\u2019intimidation ou toute forme de comportement abusif envers d\u2019autres utilisateurs
\u2022 T\u00e9l\u00e9verser, partager ou distribuer du contenu inappropri\u00e9, offensant, obsc\u00e8ne ou sexuellement explicite
\u2022 Tenter d\u2019obtenir un acc\u00e8s non autoris\u00e9 aux comptes d\u2019autres utilisateurs, aux donn\u00e9es scolaires ou aux syst\u00e8mes de la plateforme
\u2022 Partager du mat\u00e9riel prot\u00e9g\u00e9 par le droit d\u2019auteur sans l\u2019autorisation ou le consentement du titulaire des droits
\u2022 Utiliser la plateforme \u00e0 des fins commerciales sans lien avec l\u2019\u00e9ducation, y compris la publicit\u00e9, la sollicitation ou la promotion de produits ou services externes
\u2022 Introduire des logiciels malveillants, des virus ou tout autre code nuisible sur la plateforme
\u2022 Tenter de d\u00e9compiler, de d\u00e9sassembler ou d\u2019extraire le code source de la plateforme
\u2022 Utiliser des outils automatis\u00e9s, des robots ou des scripts pour acc\u00e9der \u00e0 la plateforme ou interagir avec celle-ci sans autorisation

**Application**
Les violations de la pr\u00e9sente Politique d\u2019utilisation acceptable peuvent entra\u00eener des avertissements, la suppression de contenu, la suspension temporaire ou la r\u00e9siliation permanente de l\u2019acc\u00e8s, \u00e0 la discr\u00e9tion de Wolf Whale et/ou de l\u2019administration scolaire.`,
      },
      {
        id: 'intellectual-property',
        heading: '5. Propri\u00e9t\u00e9 intellectuelle',
        body: `**Propri\u00e9t\u00e9 de Wolf Whale**
Wolf Whale LMS, y compris sa conception, son code source, son interface utilisateur, son image de marque, ses logos, sa documentation et toute la propri\u00e9t\u00e9 intellectuelle connexe, est la propri\u00e9t\u00e9 exclusive de Wolf Whale Inc. Tous droits r\u00e9serv\u00e9s. Aucune partie de la plateforme ne peut \u00eatre copi\u00e9e, reproduite, distribu\u00e9e ou utilis\u00e9e sans le consentement \u00e9crit expr\u00e8s de Wolf Whale Inc.

**Contenu g\u00e9n\u00e9r\u00e9 par les utilisateurs**
Le contenu cr\u00e9\u00e9 par les utilisateurs au sein de la plateforme, y compris, mais sans s\u2019y limiter, les travaux remis, les publications dans les discussions, les fichiers t\u00e9l\u00e9vers\u00e9s et les messages, demeure la propri\u00e9t\u00e9 intellectuelle de l\u2019utilisateur ou de son \u00e9tablissement d\u2019enseignement, selon le cas.

**Contenu des enseignants**
Les enseignants conservent tous les droits de propri\u00e9t\u00e9 intellectuelle sur leur mat\u00e9riel p\u00e9dagogique, leurs plans de cours, leurs \u00e9valuations et tout autre contenu \u00e9ducatif cr\u00e9\u00e9 ou t\u00e9l\u00e9vers\u00e9 sur la plateforme. Wolf Whale ne revendique aucun droit de propri\u00e9t\u00e9 sur le contenu cr\u00e9\u00e9 par les enseignants.

**Octroi de licence**
En t\u00e9l\u00e9versant ou en cr\u00e9ant du contenu sur Wolf Whale LMS, vous accordez \u00e0 Wolf Whale une licence limit\u00e9e et non exclusive pour h\u00e9berger, stocker, afficher et transmettre ce contenu uniquement dans le but de fournir les services \u00e9ducatifs d\u00e9crits dans les pr\u00e9sentes Conditions. Cette licence prend fin lorsque le contenu est supprim\u00e9 ou que le compte est ferm\u00e9.`,
      },
      {
        id: 'payment-terms',
        heading: '6. Conditions de paiement',
        body: `**Tarification**
Wolf Whale LMS est offert au tarif de **7\u00a0$ CAD par compte d\u2019utilisateur par ann\u00e9e**. Ce tarif comprend l\u2019acc\u00e8s complet \u00e0 toutes les fonctionnalit\u00e9s de la plateforme sans frais suppl\u00e9mentaires pour des modules ou des options compl\u00e9mentaires.

**Dur\u00e9e du contrat**
Une dur\u00e9e minimale de contrat de **2 ans** est requise. Le contrat se renouvelle automatiquement pour des p\u00e9riodes successives d\u2019un an, sauf si l\u2019une ou l\u2019autre des parties fournit un avis \u00e9crit de non-renouvellement au moins 90 jours avant la fin de la p\u00e9riode en cours.

**Calendrier de paiement**
Le paiement est exigible annuellement \u00e0 l\u2019avance, au d\u00e9but de chaque ann\u00e9e contractuelle. Les factures sont \u00e9mises 30 jours avant la date d\u2019\u00e9ch\u00e9ance du paiement. Les paiements en retard peuvent faire l\u2019objet de frais administratifs raisonnables.

**Modifications tarifaires**
Wolf Whale se r\u00e9serve le droit de modifier les tarifs moyennant un pr\u00e9avis \u00e9crit d\u2019au moins **90 jours** \u00e0 l\u2019\u00e9cole ou au district contractant. Les modifications tarifaires entrent en vigueur au d\u00e9but de la prochaine p\u00e9riode de renouvellement du contrat et ne s\u2019appliquent pas r\u00e9troactivement \u00e0 la p\u00e9riode en cours.

**Remboursements**
Les frais sont g\u00e9n\u00e9ralement non remboursables une fois pay\u00e9s. En cas de r\u00e9siliation anticip\u00e9e par l\u2019\u00e9cole (voir la section\u00a011), toute portion inutilis\u00e9e des frais pr\u00e9pay\u00e9s sera trait\u00e9e conform\u00e9ment aux dispositions de r\u00e9siliation de l\u2019entente de service.`,
      },
      {
        id: 'data-and-privacy',
        heading: '7. Donn\u00e9es et confidentialit\u00e9',
        body: `Wolf Whale s\u2019engage \u00e0 prot\u00e9ger les renseignements personnels de tous les utilisateurs, en particulier ceux des \u00e9l\u00e8ves. Nos pratiques en mati\u00e8re de donn\u00e9es sont r\u00e9gies par les lois canadiennes sur la protection de la vie priv\u00e9e.

**Conformit\u00e9 l\u00e9gale**
Wolf Whale se conforme \u00e0 la Loi sur la protection des renseignements personnels et les documents \u00e9lectroniques (LPRPDE) et \u00e0 toutes les lois provinciales applicables en mati\u00e8re de protection de la vie priv\u00e9e, y compris la Loi\u00a025 du Qu\u00e9bec, la FIPPA de la Colombie-Britannique, la FOIP Act de l\u2019Alberta et la LAIMPVP de l\u2019Ontario.

**Politique de confidentialit\u00e9**
Pour tous les d\u00e9tails sur la fa\u00e7on dont nous recueillons, utilisons, stockons et prot\u00e9geons les renseignements personnels, veuillez consulter notre [Politique de confidentialit\u00e9](/privacy). La Politique de confidentialit\u00e9 est int\u00e9gr\u00e9e par r\u00e9f\u00e9rence aux pr\u00e9sentes Conditions.

**Engagements cl\u00e9s**
\u2022 Nous ne vendons **pas** les donn\u00e9es des utilisateurs \u00e0 des tiers, en aucune circonstance
\u2022 Nous n\u2019utilisons **pas** les donn\u00e9es des \u00e9l\u00e8ves \u00e0 des fins publicitaires, de marketing ou de profilage
\u2022 Nous ne recueillons que le minimum de renseignements personnels n\u00e9cessaires \u00e0 la prestation des services \u00e9ducatifs
\u2022 Toutes les donn\u00e9es sont chiffr\u00e9es au repos et en transit
\u2022 Nous maintenons des contr\u00f4les d\u2019acc\u00e8s stricts et une journalisation des audits

**Propri\u00e9t\u00e9 des donn\u00e9es**
Les donn\u00e9es \u00e9ducatives appartiennent aux \u00e9l\u00e8ves et \u00e0 leurs \u00e9tablissements. Wolf Whale agit en tant que sous-traitant des donn\u00e9es pour le compte de l\u2019\u00e9cole.`,
      },
      {
        id: 'service-availability',
        heading: '8. Disponibilit\u00e9 du service',
        body: `**Engagement de disponibilit\u00e9**
Wolf Whale s\u2019efforce de maintenir une disponibilit\u00e9 de la plateforme de **99,9\u00a0%** pour l\u2019ensemble des services. Nous investissons dans une infrastructure fiable, la redondance et la surveillance pour offrir une exp\u00e9rience constante aux \u00e9coles.

**Maintenance planifi\u00e9e**
Les fen\u00eatres de maintenance planifi\u00e9e seront communiqu\u00e9es aux administrateurs scolaires au moins **48 heures \u00e0 l\u2019avance** dans la mesure du possible. La maintenance est g\u00e9n\u00e9ralement pr\u00e9vue en soir\u00e9e, les fins de semaine ou pendant les cong\u00e9s scolaires afin de minimiser les perturbations de l\u2019enseignement et de l\u2019apprentissage.

**Interruptions impr\u00e9vues**
En cas d\u2019interruption de service impr\u00e9vue, nous\u00a0:
\u2022 Travaillerons \u00e0 r\u00e9tablir le service le plus rapidement possible
\u2022 Communiquerons des mises \u00e0 jour aux administrateurs scolaires par courriel ou par des notifications sur la page de statut
\u2022 Fournirons un r\u00e9sum\u00e9 post-incident pour les interruptions majeures

**Limitation**
Wolf Whale n\u2019est pas responsable des interruptions de service caus\u00e9es par des circonstances ind\u00e9pendantes de notre volont\u00e9, y compris, mais sans s\u2019y limiter, les catastrophes naturelles, les pannes d\u2019Internet, les d\u00e9faillances de services tiers, les mesures gouvernementales ou les cyberattaques. Nous prendrons toutefois toutes les mesures raisonnables pour r\u00e9tablir le service rapidement.`,
      },
      {
        id: 'disclaimers',
        heading: '9. Avis de non-responsabilit\u00e9',
        body: `**Fourniture \u00ab\u00a0telle quelle\u00a0\u00bb**
Wolf Whale LMS est fourni sur une base \u00ab\u00a0telle quelle\u00a0\u00bb et \u00ab\u00a0selon la disponibilit\u00e9\u00a0\u00bb. Bien que nous nous efforcions de fournir une plateforme fiable et de haute qualit\u00e9, nous ne faisons aucune d\u00e9claration ni garantie, expresse ou implicite, concernant l\u2019ad\u00e9quation de la plateforme \u00e0 un usage particulier, sa qualit\u00e9 marchande ou sa disponibilit\u00e9 ininterrompue.

**R\u00e9sultats scolaires**
Wolf Whale est un outil de soutien \u00e0 l\u2019enseignement et \u00e0 l\u2019apprentissage. Nous ne garantissons **pas** de r\u00e9sultats scolaires sp\u00e9cifiques, de notes d\u2019examen, de r\u00e9sultats acad\u00e9miques ou de r\u00e9alisations particuli\u00e8res. L\u2019efficacit\u00e9 de la plateforme d\u00e9pend de la mani\u00e8re dont elle est utilis\u00e9e par les \u00e9ducateurs, les \u00e9l\u00e8ves et les \u00e9tablissements.

**Contenu g\u00e9n\u00e9r\u00e9 par les utilisateurs**
Wolf Whale n\u2019est pas responsable de l\u2019exactitude, de la l\u00e9galit\u00e9 ou du caract\u00e8re appropri\u00e9 du contenu cr\u00e9\u00e9 ou t\u00e9l\u00e9vers\u00e9 par les utilisateurs. Les \u00e9coles et les utilisateurs sont responsables du contenu qu\u2019ils publient sur la plateforme. Wolf Whale se r\u00e9serve le droit de retirer tout contenu qui enfreint les pr\u00e9sentes Conditions ou la loi applicable.

**Int\u00e9grations tierces**
Lorsque la plateforme s\u2019int\u00e8gre \u00e0 des services tiers ou y renvoie, Wolf Whale n\u2019est pas responsable de la disponibilit\u00e9, de l\u2019exactitude ou des pratiques de ces services tiers.`,
      },
      {
        id: 'limitation-of-liability',
        heading: '10. Limitation de responsabilit\u00e9',
        body: `**Responsabilit\u00e9 maximale**
Dans toute la mesure permise par la loi applicable, la responsabilit\u00e9 totale cumul\u00e9e de Wolf Whale envers vous ou votre \u00e9tablissement, d\u00e9coulant de ces Conditions ou de l\u2019utilisation de la plateforme, ne saurait exc\u00e9der le montant total des frais pay\u00e9s par votre \u00e9tablissement \u00e0 Wolf Whale au cours des **12 mois pr\u00e9c\u00e9dant imm\u00e9diatement** l\u2019\u00e9v\u00e9nement donnant lieu \u00e0 la r\u00e9clamation.

**Exclusion de dommages**
Wolf Whale ne sera pas responsable des dommages indirects, accessoires, sp\u00e9ciaux, cons\u00e9cutifs ou punitifs, y compris, mais sans s\u2019y limiter\u00a0:
\u2022 La perte de donn\u00e9es (au-del\u00e0 de notre obligation de maintenir des sauvegardes telle que d\u00e9crite dans notre entente de service)
\u2022 La perte de revenus ou d\u2019\u00e9conomies anticip\u00e9es
\u2022 La perte de fonds commercial ou de r\u00e9putation
\u2022 L\u2019interruption des activit\u00e9s
\u2022 Tout dommage d\u00e9coulant de circonstances ind\u00e9pendantes de notre volont\u00e9

**Exceptions**
Rien dans les pr\u00e9sentes Conditions n\u2019exclut ni ne limite la responsabilit\u00e9 pour\u00a0:
\u2022 Le d\u00e9c\u00e8s ou les l\u00e9sions corporelles caus\u00e9s par la n\u00e9gligence
\u2022 La fraude ou la d\u00e9claration frauduleuse
\u2022 Toute responsabilit\u00e9 qui ne peut \u00eatre exclue ou limit\u00e9e en vertu du droit canadien applicable`,
      },
      {
        id: 'termination',
        heading: '11. R\u00e9siliation',
        body: `**R\u00e9siliation par l\u2019une ou l\u2019autre des parties**
L\u2019une ou l\u2019autre des parties peut r\u00e9silier l\u2019entente de service en fournissant un **pr\u00e9avis \u00e9crit de 90 jours** \u00e0 l\u2019autre partie. Le pr\u00e9avis doit \u00eatre envoy\u00e9 aux coordonn\u00e9es sp\u00e9cifi\u00e9es dans l\u2019entente de service.

**Effets de la r\u00e9siliation**
\u00c0 la r\u00e9siliation de l\u2019entente\u00a0:
\u2022 Les donn\u00e9es scolaires seront rendues disponibles pour exportation sur demande dans des formats standards (CSV, JSON ou PDF)
\u2022 L\u2019\u00e9cole disposera de 30 jours apr\u00e8s la date d\u2019effet de la r\u00e9siliation pour demander l\u2019exportation des donn\u00e9es
\u2022 Toutes les donn\u00e9es scolaires seront d\u00e9finitivement supprim\u00e9es des syst\u00e8mes de Wolf Whale dans un d\u00e9lai de **60 jours** suivant la date d\u2019effet de la r\u00e9siliation, \u00e0 moins que l\u2019\u00e9cole ne demande une suppression anticip\u00e9e ou ult\u00e9rieure
\u2022 Les comptes d\u2019utilisateurs associ\u00e9s \u00e0 l\u2019\u00e9tablissement seront d\u00e9sactiv\u00e9s

**R\u00e9siliation imm\u00e9diate pour manquement grave**
L\u2019une ou l\u2019autre des parties peut r\u00e9silier l\u2019entente imm\u00e9diatement par avis \u00e9crit si l\u2019autre partie commet un manquement grave qui n\u2019est pas corrig\u00e9 dans les 30 jours suivant l\u2019avis \u00e9crit du manquement. Les manquements graves comprennent, sans s\u2019y limiter\u00a0:
\u2022 Le d\u00e9faut de paiement des frais \u00e0 l\u2019\u00e9ch\u00e9ance
\u2022 La violation des obligations en mati\u00e8re de protection des donn\u00e9es ou de la vie priv\u00e9e
\u2022 L\u2019utilisation ou la distribution non autoris\u00e9e de la plateforme
\u2022 Les violations r\u00e9p\u00e9t\u00e9es de la Politique d\u2019utilisation acceptable

**Survie**
Les dispositions relatives \u00e0 la propri\u00e9t\u00e9 intellectuelle, \u00e0 la limitation de responsabilit\u00e9, \u00e0 la confidentialit\u00e9 et au droit applicable survivent \u00e0 la r\u00e9siliation des pr\u00e9sentes Conditions.`,
      },
      {
        id: 'governing-law',
        heading: '12. Droit applicable',
        body: `**Comp\u00e9tence**
Les pr\u00e9sentes Conditions d\u2019utilisation sont r\u00e9gies et interpr\u00e9t\u00e9es conform\u00e9ment aux lois f\u00e9d\u00e9rales du Canada et aux lois de la province dans laquelle se trouve l\u2019\u00e9tablissement d\u2019enseignement contractant.

**R\u00e8glement des diff\u00e9rends**
Tout diff\u00e9rend d\u00e9coulant des pr\u00e9sentes Conditions ou de l\u2019utilisation de Wolf Whale LMS sera r\u00e9solu comme suit\u00a0:
\u2022 **N\u00e9gociation** \u2014 Les parties tenteront d\u2019abord de r\u00e9soudre le diff\u00e9rend par des n\u00e9gociations de bonne foi dans les 30 jours suivant l\u2019avis \u00e9crit du diff\u00e9rend
\u2022 **M\u00e9diation** \u2014 Si les n\u00e9gociations \u00e9chouent, les parties tenteront une m\u00e9diation devant un m\u00e9diateur mutuellement convenu au Canada
\u2022 **Arbitrage** \u2014 Si la m\u00e9diation \u00e9choue, le diff\u00e9rend sera soumis \u00e0 un arbitrage contraignant au Canada, conduit conform\u00e9ment \u00e0 la l\u00e9gislation provinciale applicable en mati\u00e8re d\u2019arbitrage

**Langue**
En cas de conflit entre les versions anglaise et fran\u00e7aise des pr\u00e9sentes Conditions, la version anglaise pr\u00e9vaudra, sauf si l\u2019\u00e9tablissement contractant est situ\u00e9 au Qu\u00e9bec, auquel cas la version fran\u00e7aise pr\u00e9vaudra conform\u00e9ment \u00e0 la Charte de la langue fran\u00e7aise du Qu\u00e9bec.`,
      },
      {
        id: 'changes-to-terms',
        heading: '13. Modifications des conditions',
        body: `**Droit de modification**
Wolf Whale se r\u00e9serve le droit de modifier, de mettre \u00e0 jour ou de remplacer les pr\u00e9sentes Conditions d\u2019utilisation \u00e0 tout moment. Les modifications peuvent \u00eatre apport\u00e9es pour refl\u00e9ter de nouvelles fonctionnalit\u00e9s, des exigences l\u00e9gales ou des pratiques commerciales.

**Avis de modifications**
Nous fournirons un **pr\u00e9avis \u00e9crit d\u2019au moins 30 jours** aux administrateurs scolaires avant l\u2019entr\u00e9e en vigueur de toute modification importante aux pr\u00e9sentes Conditions. L\u2019avis sera transmis par\u00a0:
\u2022 Courriel au contact d\u00e9sign\u00e9 de l\u2019administrateur scolaire
\u2022 Un avis visible sur la plateforme Wolf Whale LMS
\u2022 Une publication mise \u00e0 jour sur notre site Web avec une date de \u00ab\u00a0Derni\u00e8re mise \u00e0 jour\u00a0\u00bb r\u00e9vis\u00e9e

**Acceptation des modifications**
L\u2019utilisation continue de Wolf Whale LMS apr\u00e8s la date d\u2019entr\u00e9e en vigueur des Conditions modifi\u00e9es vaut acceptation des Conditions r\u00e9vis\u00e9es. Si une \u00e9cole ou un utilisateur n\u2019est pas d\u2019accord avec les modifications, il devrait cesser d\u2019utiliser la plateforme et communiquer avec nous pour discuter de ses pr\u00e9occupations ou initier une r\u00e9siliation en vertu de la section\u00a011.

**Versions ant\u00e9rieures**
Les versions ant\u00e9rieures des pr\u00e9sentes Conditions sont disponibles sur demande en communiquant avec legal@wolfwhale.ca.`,
      },
      {
        id: 'contact',
        heading: '14. Contact',
        body: `Si vous avez des questions, des pr\u00e9occupations ou des demandes concernant les pr\u00e9sentes Conditions d\u2019utilisation, veuillez communiquer avec nous\u00a0:

**Demandes juridiques**
Wolf Whale Inc.
Courriel\u00a0: legal@wolfwhale.ca

**Demandes g\u00e9n\u00e9rales**
Wolf Whale LMS
Courriel\u00a0: info@wolfwhale.ca
T\u00e9l\u00e9phone\u00a0: +1 (306) 981-5926

**D\u00e9lais de r\u00e9ponse**
\u2022 Demandes juridiques\u00a0: dans les 10 jours ouvrables
\u2022 Demandes g\u00e9n\u00e9rales\u00a0: dans les 5 jours ouvrables
\u2022 Questions urgentes\u00a0: dans les 48 heures

Nous nous engageons \u00e0 traiter toutes les demandes de mani\u00e8re rapide et professionnelle.`,
      },
    ],
  },
}

function renderMarkdown(text: string) {
  const paragraphs = text.split('\n\n')

  return paragraphs.map((paragraph, pIdx) => {
    // Check if it's a list of bullet points
    if (paragraph.includes('\n\u2022')) {
      const lines = paragraph.split('\n').filter(Boolean)
      const intro = lines[0].startsWith('\u2022') ? null : lines[0]
      const items = lines.filter((l) => l.startsWith('\u2022'))

      return (
        <div key={pIdx} className="mb-4">
          {intro && (
            <p className="mb-2 text-[#0A2540]/70" dangerouslySetInnerHTML={{ __html: formatInline(intro) }} />
          )}
          <ul className="space-y-1.5 ml-1">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="flex items-start gap-2 text-[#0A2540]/70">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#00BFFF] flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(item.slice(2)) }} />
              </li>
            ))}
          </ul>
        </div>
      )
    }

    // Check if paragraph starts with a bullet
    if (paragraph.startsWith('\u2022')) {
      const items = paragraph.split('\n').filter(Boolean)
      return (
        <ul key={pIdx} className="space-y-1.5 ml-1 mb-4">
          {items.map((item, iIdx) => (
            <li key={iIdx} className="flex items-start gap-2 text-[#0A2540]/70">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#00BFFF] flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item.slice(2)) }} />
            </li>
          ))}
        </ul>
      )
    }

    // Regular paragraph
    return (
      <p
        key={pIdx}
        className="mb-4 text-[#0A2540]/70 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }}
      />
    )
  })
}

function formatInline(text: string): string {
  // Bold **text**
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#0A2540] font-semibold">$1</strong>')
  // Links
  result = result.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#00BFFF] hover:underline">$1</a>'
  )
  // Email
  result = result.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1" class="text-[#00BFFF] hover:underline">$1</a>'
  )
  return result
}

export default function TermsOfServicePage() {
  const [lang, setLang] = useState<Lang>('en')
  const t = content[lang]

  return (
    <div
      className="min-h-screen text-[#0A2540]"
      style={{
        background: 'linear-gradient(135deg, #E8F8FF 0%, #D0F0FF 25%, #B0E8FF 50%, #D0F0FF 75%, #E8F8FF 100%)',
      }}
    >
      {/* Floating Bubble Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-3 h-3 rounded-full bubble-float bg-[#00BFFF]/10" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-[15%] w-2 h-2 rounded-full bubble-float bg-[#00FFFF]/8" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] left-[5%] w-4 h-4 rounded-full bubble-float bg-[#00BFFF]/10" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[50%] right-[8%] w-2.5 h-2.5 rounded-full bubble-float bg-[#00FFFF]/8" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[70%] left-[20%] w-3.5 h-3.5 rounded-full bubble-float bg-[#00BFFF]/10" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[15%] right-[30%] w-2 h-2 rounded-full bubble-float bg-[#00FFFF]/8" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[60%] left-[40%] w-3 h-3 rounded-full bubble-float bg-[#00BFFF]/10" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-[85%] right-[25%] w-2 h-2 rounded-full bubble-float bg-[#00FFFF]/8" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#0A2540]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Wolf Whale Logo"
              width={48}
              height={48}
              className="rounded-xl object-contain border-2 border-black"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-display font-bold text-[#0A2540] group-hover:text-[#00BFFF] transition-colors tracking-wider uppercase">
                Wolf Whale
              </h1>
              <p className="text-[10px] sm:text-xs text-[#0A2540]/50 font-display font-semibold tracking-widest uppercase">Learning Management System</p>
            </div>
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Globe className="h-4 w-4 text-[#0A2540]/40 hidden sm:block" />
            <div className="flex rounded-lg border border-[#0A2540]/10 overflow-hidden">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-[#00BFFF] text-white'
                    : 'text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-[#0A2540]/5'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  lang === 'fr'
                    ? 'bg-[#00BFFF] text-white'
                    : 'text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-[#0A2540]/5'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0A2540]/50 hover:text-[#00BFFF] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToHome}
        </Link>

        {/* Title Block */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#00BFFF] to-[#33FF33] shadow-2xl mb-6 text-white-outlined">
            <span className="text-white font-bold text-3xl">W</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-[#0A2540]">{t.title}</h1>
          <p className="text-lg sm:text-xl text-[#0A2540]/60 mb-2">{t.subtitle}</p>
          <p className="text-sm text-[#0A2540]/40">{t.lastUpdated}</p>
        </div>

        {/* Table of Contents */}
        <nav className="liquid-glass rounded-2xl p-5 sm:p-6 border border-[#0A2540]/10 mb-10 sm:mb-12">
          <h2 className="text-sm font-semibold text-[#0A2540]/50 uppercase tracking-wider mb-4">
            {lang === 'en' ? 'Table of Contents' : 'Table des mati\u00e8res'}
          </h2>
          <ol className="space-y-1.5">
            {t.sections.map((section, idx) => (
              <li key={idx}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-[#0A2540]/70 hover:text-[#00BFFF] transition-colors block py-0.5"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-10 sm:space-y-12">
          {t.sections.map((section, idx) => (
            <section key={idx} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-[#0A2540] border-b border-[#0A2540]/10 pb-3">
                {section.heading}
              </h2>
              <div className="text-sm sm:text-base leading-relaxed">
                {renderMarkdown(section.body)}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#0A2540]/10 mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#0A2540]/40">
              &copy; 2026 Wolf Whale LMS. {lang === 'en' ? 'All rights reserved.' : 'Tous droits r\u00e9serv\u00e9s.'}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[#0A2540]/50 hover:text-[#00BFFF] transition-colors"
              >
                {lang === 'en' ? 'Privacy' : 'Confidentialit\u00e9'}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[#00BFFF] font-medium"
              >
                {lang === 'en' ? 'Terms' : 'Conditions'}
              </Link>
              <Link
                href="/help"
                className="text-sm text-[#0A2540]/50 hover:text-[#00BFFF] transition-colors"
              >
                {lang === 'en' ? 'Help' : 'Aide'}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
