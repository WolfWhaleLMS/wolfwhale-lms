import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'

type Lang = 'en' | 'fr'

const LAST_UPDATED = '2026-02-10'

const content = {
  en: {
    title: 'Privacy Policy',
    subtitle: 'WolfWhale LMS',
    lastUpdated: `Last updated: ${LAST_UPDATED}`,
    backToHome: 'Back to Home',
    sections: [
      {
        id: 'introduction',
        heading: '1. Introduction',
        body: `WolfWhale LMS ("WolfWhale," "we," "us," or "our") is a Canadian learning management system designed for K\u201312 schools. We are committed to protecting the privacy and security of all personal information entrusted to us by students, parents, guardians, teachers, school administrators, and other users.

This Privacy Policy explains what information we collect, how we use it, how we protect it, and your rights regarding your personal information. WolfWhale is headquartered in Canada and is subject to Canadian federal and provincial privacy legislation.

By using WolfWhale LMS, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please do not access or use the platform.`,
      },
      {
        id: 'information-we-collect',
        heading: '2. Information We Collect',
        body: `We collect the minimum amount of personal information necessary to deliver educational services. The categories of information we collect include:

**Account Information**
\u2022 Student names and school-issued email addresses
\u2022 Teacher and administrator names and professional email addresses
\u2022 Parent/guardian names and contact email addresses
\u2022 User role within the school (student, teacher, administrator, parent)

**Educational Records**
\u2022 Grades, marks, and assessment scores
\u2022 Assignment submissions (text, uploaded files)
\u2022 Quiz and test responses
\u2022 Attendance records (present, absent, tardy, excused)
\u2022 Course enrollment and progress data

**Usage Data**
\u2022 Login timestamps and session duration
\u2022 Pages visited within the platform
\u2022 Features used (messaging, study mode, flashcards)
\u2022 Device type and browser information (collected automatically for troubleshooting)

We do **not** collect social insurance numbers, financial information, biometric data, or any information beyond what is required for educational purposes.`,
      },
      {
        id: 'how-we-use-information',
        heading: '3. How We Use Information',
        body: `We use collected information exclusively for legitimate educational purposes:

\u2022 **Delivering Educational Services** \u2014 Enabling course delivery, assignment submission, grading, attendance tracking, and communication between teachers, students, and parents.
\u2022 **Platform Functionality** \u2014 Powering features such as the gradebook, messaging, calendars, gamification (XP and badges), study mode, and notifications.
\u2022 **School Administration** \u2014 Providing school administrators with enrollment statistics, aggregate performance reports, and platform usage insights.
\u2022 **Platform Improvement** \u2014 Analyzing aggregate, de-identified usage patterns to improve features, fix issues, and enhance the user experience.
\u2022 **Safety and Security** \u2014 Detecting and preventing unauthorized access, abuse, or security threats.

**We do not:**
\u2022 Sell personal information to any third party, under any circumstances
\u2022 Use student data for advertising or marketing purposes
\u2022 Build advertising profiles based on student behaviour
\u2022 Share student information with advertisers or data brokers
\u2022 Use personal information for any purpose unrelated to education`,
      },
      {
        id: 'legal-basis',
        heading: '4. Legal Basis for Processing',
        body: `We process personal information on the following legal grounds:

**Consent**
Where required by law, we obtain informed consent before collecting, using, or disclosing personal information. For students under the age of majority in their province, consent is obtained from a parent or legal guardian. Consent may be withdrawn at any time by contacting us or the school administrator.

**Legitimate Educational Interest**
We process personal information when it is necessary for the provision of educational services as contracted between WolfWhale and the educational institution. Schools act as the data controllers and direct our processing activities in accordance with their educational mandates.

**Contractual Necessity**
We process data as necessary to fulfil our contractual obligations to the educational institutions we serve, including the provision of learning management services, technical support, and platform maintenance.

**Legal Obligation**
We may process or retain personal information when required to do so by applicable law, regulation, or valid legal process.`,
      },
      {
        id: 'pipeda',
        heading: '5. PIPEDA Compliance',
        body: `WolfWhale complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) and adheres to its ten fair information principles:

**1. Accountability** \u2014 We have designated a Privacy Officer responsible for our compliance with privacy legislation. Our team is trained on privacy obligations and data handling procedures.

**2. Identifying Purposes** \u2014 We identify and document the purposes for which personal information is collected at or before the time of collection. These purposes are described in this Privacy Policy.

**3. Consent** \u2014 We obtain meaningful consent for the collection, use, and disclosure of personal information. For minors, consent is obtained from parents or guardians. We offer clear mechanisms for withdrawing consent.

**4. Limiting Collection** \u2014 We collect only the personal information necessary for the identified educational purposes. We do not collect information indiscriminately or excessively.

**5. Limiting Use, Disclosure, and Retention** \u2014 Personal information is used and disclosed only for the purposes for which it was collected, unless consent is obtained or as required by law. Information is retained only as long as necessary to fulfil those purposes.

**6. Accuracy** \u2014 We take reasonable steps to ensure personal information is accurate, complete, and up-to-date. Users and school administrators can update account information at any time.

**7. Safeguards** \u2014 We protect personal information with security safeguards appropriate to the sensitivity of the information, including encryption at rest and in transit, access controls, and audit logging.

**8. Openness** \u2014 We make information about our privacy policies and practices readily available through this Privacy Policy and upon request.

**9. Individual Access** \u2014 Upon request and subject to verification, individuals have the right to access their personal information held by WolfWhale and to challenge its accuracy.

**10. Challenging Compliance** \u2014 Individuals may direct complaints or inquiries about our compliance with privacy legislation to our Privacy Officer at privacy@wolfwhale.ca.`,
      },
      {
        id: 'provincial-compliance',
        heading: '6. Provincial Law Compliance',
        body: `In addition to PIPEDA, WolfWhale complies with applicable provincial privacy legislation across Canada:

**British Columbia \u2014 Freedom of Information and Protection of Privacy Act (FIPPA)**
When providing services to public bodies in British Columbia, we ensure that personal information is stored and accessed only in Canada, unless disclosure outside Canada is authorized. We cooperate with public bodies to meet their obligations under FIPPA, including responding to access requests and ensuring appropriate data handling.

**Ontario \u2014 Municipal Freedom of Information and Protection of Privacy Act (MFIPPA)**
For Ontario school boards, we comply with MFIPPA requirements regarding the collection, use, retention, and disclosure of personal information. We support school boards in meeting their notice and access obligations and maintain appropriate data handling agreements.

**Quebec \u2014 Act Respecting the Protection of Personal Information in the Private Sector (Law 25)**
WolfWhale complies with Quebec's Law 25 (\u00ab Loi 25 \u00bb), including:
\u2022 Conducting privacy impact assessments (PIA) for any project involving the collection, use, or disclosure of personal information
\u2022 Appointing a person responsible for the protection of personal information
\u2022 Implementing a framework for the governance of personal information
\u2022 Maintaining an incident register and notifying the Commission d'acc\u00e8s \u00e0 l'information du Qu\u00e9bec (CAI) in case of a confidentiality incident presenting a risk of serious prejudice
\u2022 Providing privacy policies in clear and simple language
\u2022 Obtaining consent in a manifest, free, and informed manner
\u2022 Enabling the right to data portability in a commonly used technological format

**Alberta \u2014 Freedom of Information and Protection of Privacy Act (FOIP)**
When serving Alberta educational institutions, we comply with FOIP Act requirements, including ensuring personal information is collected under proper authority, used only for the purpose for which it was collected, and protected with reasonable security measures. We support institutions in conducting privacy impact assessments as required under FOIP.`,
      },
      {
        id: 'parental-rights',
        heading: '7. Parental Rights',
        body: `We recognize the special protections required for children's personal information in the educational context.

**Consent for Minors**
For students under the age of 13, we require verifiable parental or guardian consent before collecting personal information, consistent with best practices and applicable law. For students aged 13 and under the age of majority in their province (typically 18 or 19), schools generally provide consent on behalf of parents as part of the educational relationship, though parents retain the right to review and object.

**Right of Access**
Parents and guardians have the right to:
\u2022 Review the personal information collected about their child
\u2022 Request a copy of their child's educational records stored on the platform
\u2022 View their child's grades, attendance, submissions, and activity through the Parent Portal

**Right to Consent and Withdraw**
Parents and guardians may:
\u2022 Provide or withhold consent for the collection and use of their child's information
\u2022 Withdraw previously given consent by contacting the school or WolfWhale directly
\u2022 Request that we cease collecting or using their child's information going forward

**Right to Deletion**
Parents and guardians may request the deletion of their child's personal information. Deletion requests are processed in coordination with the school, as some records may need to be retained for legitimate educational or regulatory purposes. See Section 11 for details on the deletion process.

**Exercising Parental Rights**
Parents may exercise these rights by contacting their school administrator or by reaching out to us directly at privacy@wolfwhale.ca. We will verify the identity of the requester before processing any request.`,
      },
      {
        id: 'data-storage-security',
        heading: '8. Data Storage and Security',
        body: `We employ comprehensive security measures to protect personal information:

**Infrastructure**
\u2022 All data is stored using Supabase, a secure, enterprise-grade database platform built on PostgreSQL
\u2022 The application is hosted on Vercel\u2019s edge network with DDoS protection and automatic SSL
\u2022 Database infrastructure includes automated backups, point-in-time recovery, and high availability

**Encryption**
\u2022 All data is encrypted at rest using AES-256 encryption
\u2022 All data in transit is encrypted using TLS 1.2 or higher
\u2022 Database connections use SSL/TLS encryption

**Access Controls**
\u2022 Row-Level Security (RLS) in PostgreSQL ensures that users can only access data they are authorized to see
\u2022 Role-based access control (RBAC) restricts platform features based on user roles (student, teacher, admin, parent)
\u2022 Multi-tenant architecture ensures complete data isolation between schools
\u2022 Administrative access to production systems is restricted and logged

**Monitoring and Auditing**
\u2022 Comprehensive audit logging tracks all data access and modifications
\u2022 Automated monitoring detects and alerts on anomalous activity
\u2022 Regular security reviews and vulnerability assessments are conducted

**Data Location**
Data may be stored and processed in Canada and/or the United States through our infrastructure providers (Supabase and Vercel). For institutions requiring data residency in Canada, we offer configurations to ensure data remains within Canadian borders.`,
      },
      {
        id: 'data-retention',
        heading: '9. Data Retention',
        body: `We retain personal information only as long as necessary to fulfil the educational purposes for which it was collected and to meet our legal obligations.

**Active Enrollment**
While a student is actively enrolled and using the platform, we retain all educational records necessary for the school's ongoing educational activities, including grades, attendance records, assignment submissions, and course progress.

**Post-Enrollment**
After a student's enrollment ends or the school's contract with WolfWhale concludes:
\u2022 Educational records are retained for a reasonable period (typically the remainder of the academic year plus one additional year) to allow for transcript requests, administrative follow-up, and dispute resolution
\u2022 Schools may request earlier deletion or extended retention based on their institutional policies and legal requirements
\u2022 Account access is deactivated promptly upon notification from the school

**Anonymized Data**
We may retain anonymized, aggregated data that cannot be used to identify any individual for the purpose of improving our platform and generating statistical insights. This data is not subject to deletion requests as it is no longer personal information.

**Regulatory Retention**
Some records may be retained longer if required by applicable law or regulation, or if needed for the establishment, exercise, or defence of legal claims.`,
      },
      {
        id: 'data-portability',
        heading: '10. Data Portability',
        body: `Users have the right to request a copy of their personal information in a structured, commonly used, and machine-readable format.

**What Can Be Exported**
\u2022 Student records: grades, attendance history, assignment submissions, course enrollment history
\u2022 Teacher records: course content, gradebook data, attendance records
\u2022 Parent records: linked student information visible through the Parent Portal
\u2022 Account information: profile data, contact details

**How to Request an Export**
\u2022 School administrators can generate data exports through the Admin Dashboard
\u2022 Individual users or parents may submit a data portability request to privacy@wolfwhale.ca
\u2022 Requests are processed within 30 days of receipt

**Export Formats**
Data exports are provided in standard formats such as CSV, JSON, or PDF, depending on the nature of the data. We work with institutions to ensure exports are compatible with other systems where feasible.`,
      },
      {
        id: 'data-deletion',
        heading: '11. Data Deletion',
        body: `Users, parents, and school administrators have the right to request the deletion of personal information.

**How to Request Deletion**
\u2022 Contact us at privacy@wolfwhale.ca with a deletion request
\u2022 School administrators can initiate deletion through the Admin Dashboard
\u2022 Parents may request deletion of their child's data by contacting the school or WolfWhale directly

**Processing Timeline**
\u2022 Deletion requests are acknowledged within 5 business days
\u2022 Deletion is completed within 30 calendar days of the request
\u2022 We will confirm deletion in writing once processing is complete

**Scope of Deletion**
Upon a valid deletion request, we will delete or de-identify:
\u2022 Account information and profile data
\u2022 Educational records including grades, attendance, and submissions
\u2022 Messages and communications stored on the platform
\u2022 Usage and activity logs associated with the account

**Exceptions**
Certain information may be retained after a deletion request where:
\u2022 Retention is required by applicable law or regulation
\u2022 Retention is necessary for the establishment, exercise, or defence of legal claims
\u2022 The school has directed us to retain records for legitimate educational or administrative purposes
\u2022 The data has been fully anonymized and can no longer identify any individual

We will inform the requester of any data that cannot be deleted and the legal basis for its retention.`,
      },
      {
        id: 'breach-notification',
        heading: '12. Breach Notification',
        body: `In the event of a security breach involving personal information, we follow a rigorous incident response protocol.

**Notification to the Privacy Commissioner**
We will report any breach of security safeguards involving personal information that creates a real risk of significant harm to the Office of the Privacy Commissioner of Canada within 72 hours of becoming aware of the breach, as required by PIPEDA.

**Notification to Affected Parties**
\u2022 We will notify affected individuals and the relevant school as soon as feasible after discovering a breach
\u2022 Notifications will include a description of the incident, the types of information involved, the steps we have taken to address the breach, and recommended actions for affected individuals
\u2022 For Quebec institutions, we will also notify the Commission d'acc\u00e8s \u00e0 l'information du Qu\u00e9bec (CAI) of any confidentiality incident presenting a risk of serious prejudice

**Provincial Notification**
We comply with provincial breach notification requirements, including those under Alberta's PIPA, Quebec's Law 25, and any other applicable provincial legislation.

**Breach Register**
We maintain a register of all security incidents involving personal information, including those that do not meet the threshold for notification, as required by PIPEDA and Quebec's Law 25.

**Mitigation**
Upon discovering a breach, we immediately take steps to contain the incident, assess the scope of impact, mitigate potential harm, and implement measures to prevent recurrence.`,
      },
      {
        id: 'third-party-services',
        heading: '13. Third-Party Services',
        body: `WolfWhale uses a limited number of third-party service providers to deliver and host the platform. We carefully vet each provider for privacy and security compliance.

**Supabase** (Database and Authentication)
\u2022 Provides PostgreSQL database hosting, user authentication, and real-time functionality
\u2022 Data is encrypted at rest and in transit
\u2022 SOC 2 Type II compliant
\u2022 Learn more: https://supabase.com/privacy

**Vercel** (Application Hosting)
\u2022 Hosts the WolfWhale web application and provides edge computing, CDN, and SSL
\u2022 SOC 2 Type II compliant
\u2022 Learn more: https://vercel.com/legal/privacy-policy

**What We Do Not Do**
\u2022 We do not share student data with advertisers, data brokers, or marketing companies
\u2022 We do not embed third-party advertising or tracking pixels on the platform
\u2022 We do not use student data for any commercial purpose beyond providing the educational service
\u2022 We do not allow third-party providers to use student data for their own purposes

All third-party providers are contractually bound to handle personal information in accordance with our privacy standards and applicable Canadian privacy law.`,
      },
      {
        id: 'contact',
        heading: '14. Contact Information',
        body: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Privacy Officer**
WolfWhale LMS
Email: privacy@wolfwhale.ca
Phone: +1 (306) 981-5926

**Response Times**
\u2022 General inquiries: within 10 business days
\u2022 Access requests: within 30 calendar days
\u2022 Deletion requests: acknowledged within 5 business days, completed within 30 calendar days
\u2022 Urgent privacy concerns: within 48 hours

**Filing a Complaint**
If you are not satisfied with our response, you have the right to file a complaint with:
\u2022 The Office of the Privacy Commissioner of Canada (www.priv.gc.ca)
\u2022 Your provincial privacy commissioner or information and privacy authority
\u2022 In Quebec: the Commission d'acc\u00e8s \u00e0 l'information du Qu\u00e9bec (www.cai.gouv.qc.ca)`,
      },
      {
        id: 'updates',
        heading: '15. Updates to This Privacy Policy',
        body: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.

**How We Notify You**
\u2022 Material changes will be communicated through a notice on the platform and/or by email to school administrators
\u2022 The "Last updated" date at the top of this policy will be revised
\u2022 For significant changes affecting student data, we will provide at least 30 days\u2019 advance notice

**Continued Use**
Continued use of WolfWhale LMS after changes to this Privacy Policy constitutes acceptance of the revised terms. If you disagree with the changes, you should discontinue use and contact us to discuss your concerns.

**Previous Versions**
Previous versions of this Privacy Policy are available upon request by contacting privacy@wolfwhale.ca.`,
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialit\u00e9',
    subtitle: 'WolfWhale LMS',
    lastUpdated: `Derni\u00e8re mise \u00e0 jour\u00a0: ${LAST_UPDATED}`,
    backToHome: 'Retour \u00e0 l\u2019accueil',
    sections: [
      {
        id: 'introduction',
        heading: '1. Introduction',
        body: `WolfWhale LMS (\u00ab\u00a0WolfWhale\u00a0\u00bb, \u00ab\u00a0nous\u00a0\u00bb ou \u00ab\u00a0notre\u00a0\u00bb) est un syst\u00e8me de gestion de l\u2019apprentissage canadien con\u00e7u pour les \u00e9coles de la maternelle \u00e0 la 12e ann\u00e9e. Nous nous engageons \u00e0 prot\u00e9ger la vie priv\u00e9e et la s\u00e9curit\u00e9 de tous les renseignements personnels qui nous sont confi\u00e9s par les \u00e9l\u00e8ves, les parents, les tuteurs, les enseignants, les administrateurs scolaires et les autres utilisateurs.

La pr\u00e9sente Politique de confidentialit\u00e9 explique les renseignements que nous recueillons, la fa\u00e7on dont nous les utilisons, les mesures que nous prenons pour les prot\u00e9ger et vos droits en ce qui concerne vos renseignements personnels. WolfWhale a son si\u00e8ge social au Canada et est assujetti aux lois f\u00e9d\u00e9rales et provinciales canadiennes en mati\u00e8re de protection de la vie priv\u00e9e.

En utilisant WolfWhale LMS, vous acceptez la collecte et l\u2019utilisation des renseignements conform\u00e9ment \u00e0 la pr\u00e9sente politique. Si vous n\u2019\u00eates pas d\u2019accord avec les modalit\u00e9s de cette politique, veuillez ne pas acc\u00e9der \u00e0 la plateforme ni l\u2019utiliser.`,
      },
      {
        id: 'information-we-collect',
        heading: '2. Renseignements que nous recueillons',
        body: `Nous recueillons le minimum de renseignements personnels n\u00e9cessaires \u00e0 la prestation des services \u00e9ducatifs. Les cat\u00e9gories de renseignements recueillis comprennent\u00a0:

**Renseignements sur le compte**
\u2022 Noms des \u00e9l\u00e8ves et adresses courriel fournies par l\u2019\u00e9cole
\u2022 Noms des enseignants et des administrateurs et adresses courriel professionnelles
\u2022 Noms des parents ou tuteurs et adresses courriel de contact
\u2022 R\u00f4le de l\u2019utilisateur au sein de l\u2019\u00e9cole (\u00e9l\u00e8ve, enseignant, administrateur, parent)

**Dossiers scolaires**
\u2022 Notes, r\u00e9sultats et scores d\u2019\u00e9valuation
\u2022 Travaux remis (textes, fichiers t\u00e9l\u00e9vers\u00e9s)
\u2022 R\u00e9ponses aux questionnaires et aux examens
\u2022 Registres de pr\u00e9sence (pr\u00e9sent, absent, en retard, motiv\u00e9)
\u2022 Donn\u00e9es d\u2019inscription et de progression dans les cours

**Donn\u00e9es d\u2019utilisation**
\u2022 Horodatages de connexion et dur\u00e9e des sessions
\u2022 Pages visit\u00e9es sur la plateforme
\u2022 Fonctionnalit\u00e9s utilis\u00e9es (messagerie, mode \u00e9tude, cartes m\u00e9moire)
\u2022 Type d\u2019appareil et informations sur le navigateur (recueillis automatiquement \u00e0 des fins de d\u00e9pannage)

Nous ne recueillons **pas** de num\u00e9ros d\u2019assurance sociale, de renseignements financiers, de donn\u00e9es biom\u00e9triques ni aucun renseignement au-del\u00e0 de ce qui est requis \u00e0 des fins \u00e9ducatives.`,
      },
      {
        id: 'how-we-use-information',
        heading: '3. Utilisation des renseignements',
        body: `Nous utilisons les renseignements recueillis exclusivement \u00e0 des fins \u00e9ducatives l\u00e9gitimes\u00a0:

\u2022 **Prestation des services \u00e9ducatifs** \u2014 Permettre la diffusion des cours, la remise des travaux, la notation, le suivi des pr\u00e9sences et la communication entre enseignants, \u00e9l\u00e8ves et parents.
\u2022 **Fonctionnalit\u00e9s de la plateforme** \u2014 Alimenter les fonctionnalit\u00e9s telles que le carnet de notes, la messagerie, les calendriers, la ludification (XP et badges), le mode \u00e9tude et les notifications.
\u2022 **Administration scolaire** \u2014 Fournir aux administrateurs scolaires des statistiques d\u2019inscription, des rapports de rendement agr\u00e9g\u00e9s et des aper\u00e7us de l\u2019utilisation de la plateforme.
\u2022 **Am\u00e9lioration de la plateforme** \u2014 Analyser des donn\u00e9es d\u2019utilisation agr\u00e9g\u00e9es et d\u00e9personnalis\u00e9es afin d\u2019am\u00e9liorer les fonctionnalit\u00e9s, de corriger les probl\u00e8mes et d\u2019enrichir l\u2019exp\u00e9rience utilisateur.
\u2022 **S\u00e9curit\u00e9 et s\u00fbret\u00e9** \u2014 D\u00e9tecter et pr\u00e9venir les acc\u00e8s non autoris\u00e9s, les abus ou les menaces \u00e0 la s\u00e9curit\u00e9.

**Nous ne faisons pas ce qui suit\u00a0:**
\u2022 Vendre des renseignements personnels \u00e0 des tiers, en aucune circonstance
\u2022 Utiliser les donn\u00e9es des \u00e9l\u00e8ves \u00e0 des fins publicitaires ou de marketing
\u2022 Constituer des profils publicitaires fond\u00e9s sur le comportement des \u00e9l\u00e8ves
\u2022 Partager les renseignements des \u00e9l\u00e8ves avec des annonceurs ou des courtiers en donn\u00e9es
\u2022 Utiliser les renseignements personnels \u00e0 des fins sans lien avec l\u2019\u00e9ducation`,
      },
      {
        id: 'legal-basis',
        heading: '4. Fondement juridique du traitement',
        body: `Nous traitons les renseignements personnels sur les fondements juridiques suivants\u00a0:

**Consentement**
Lorsque la loi l\u2019exige, nous obtenons un consentement \u00e9clair\u00e9 avant de recueillir, d\u2019utiliser ou de communiquer des renseignements personnels. Pour les \u00e9l\u00e8ves n\u2019ayant pas atteint l\u2019\u00e2ge de la majorit\u00e9 dans leur province, le consentement est obtenu aupr\u00e8s d\u2019un parent ou d\u2019un tuteur l\u00e9gal. Le consentement peut \u00eatre retir\u00e9 en tout temps en communiquant avec nous ou avec l\u2019administrateur scolaire.

**Int\u00e9r\u00eat \u00e9ducatif l\u00e9gitime**
Nous traitons des renseignements personnels lorsque cela est n\u00e9cessaire \u00e0 la prestation des services \u00e9ducatifs, conform\u00e9ment au contrat conclu entre WolfWhale et l\u2019\u00e9tablissement d\u2019enseignement. Les \u00e9coles agissent \u00e0 titre de responsables du traitement des donn\u00e9es et orientent nos activit\u00e9s de traitement conform\u00e9ment \u00e0 leurs mandats \u00e9ducatifs.

**N\u00e9cessit\u00e9 contractuelle**
Nous traitons les donn\u00e9es selon les n\u00e9cessit\u00e9s li\u00e9es \u00e0 l\u2019ex\u00e9cution de nos obligations contractuelles envers les \u00e9tablissements d\u2019enseignement que nous desservons, y compris la prestation de services de gestion de l\u2019apprentissage, le soutien technique et la maintenance de la plateforme.

**Obligation l\u00e9gale**
Nous pouvons traiter ou conserver des renseignements personnels lorsque la loi, la r\u00e9glementation ou une proc\u00e9dure juridique valide l\u2019exige.`,
      },
      {
        id: 'pipeda',
        heading: '5. Conformit\u00e9 \u00e0 la LPRPDE',
        body: `WolfWhale se conforme \u00e0 la Loi sur la protection des renseignements personnels et les documents \u00e9lectroniques (LPRPDE) et respecte ses dix principes relatifs \u00e0 l\u2019\u00e9quit\u00e9 dans le traitement de l\u2019information\u00a0:

**1. Responsabilit\u00e9** \u2014 Nous avons d\u00e9sign\u00e9 un responsable de la protection de la vie priv\u00e9e charg\u00e9 de veiller \u00e0 notre conformit\u00e9 aux lois sur la protection des renseignements personnels. Notre \u00e9quipe est form\u00e9e sur les obligations en mati\u00e8re de vie priv\u00e9e et les proc\u00e9dures de traitement des donn\u00e9es.

**2. D\u00e9termination des fins** \u2014 Nous d\u00e9terminons et documentons les fins auxquelles les renseignements personnels sont recueillis au moment de la collecte ou avant celle-ci. Ces fins sont d\u00e9crites dans la pr\u00e9sente Politique de confidentialit\u00e9.

**3. Consentement** \u2014 Nous obtenons un consentement valable pour la collecte, l\u2019utilisation et la communication des renseignements personnels. Pour les mineurs, le consentement est obtenu aupr\u00e8s des parents ou des tuteurs. Nous offrons des m\u00e9canismes clairs pour le retrait du consentement.

**4. Limitation de la collecte** \u2014 Nous ne recueillons que les renseignements personnels n\u00e9cessaires aux fins \u00e9ducatives d\u00e9termin\u00e9es. Nous ne recueillons pas de renseignements de mani\u00e8re indiscrimine\u0301e ou excessive.

**5. Limitation de l\u2019utilisation, de la communication et de la conservation** \u2014 Les renseignements personnels ne sont utilis\u00e9s et communiqu\u00e9s qu\u2019aux fins pour lesquelles ils ont \u00e9t\u00e9 recueillis, sauf si un consentement est obtenu ou si la loi l\u2019exige. Les renseignements ne sont conserv\u00e9s que le temps n\u00e9cessaire \u00e0 la r\u00e9alisation de ces fins.

**6. Exactitude** \u2014 Nous prenons des mesures raisonnables pour nous assurer que les renseignements personnels sont exacts, complets et \u00e0 jour. Les utilisateurs et les administrateurs scolaires peuvent mettre \u00e0 jour les renseignements de compte en tout temps.

**7. Mesures de s\u00e9curit\u00e9** \u2014 Nous prot\u00e9geons les renseignements personnels au moyen de mesures de s\u00e9curit\u00e9 adapt\u00e9es au caract\u00e8re sensible des renseignements, y compris le chiffrement au repos et en transit, les contr\u00f4les d\u2019acc\u00e8s et la journalisation des audits.

**8. Transparence** \u2014 Nous rendons facilement accessibles les renseignements sur nos politiques et pratiques en mati\u00e8re de vie priv\u00e9e par l\u2019interm\u00e9diaire de la pr\u00e9sente Politique de confidentialit\u00e9 et sur demande.

**9. Acc\u00e8s aux renseignements personnels** \u2014 Sur demande et sous r\u00e9serve de v\u00e9rification, les personnes ont le droit d\u2019acc\u00e9der aux renseignements personnels que WolfWhale d\u00e9tient \u00e0 leur sujet et d\u2019en contester l\u2019exactitude.

**10. Possibilit\u00e9 de porter plainte** \u2014 Toute personne peut adresser ses plaintes ou ses demandes de renseignements au sujet de notre conformit\u00e9 aux lois sur la protection des renseignements personnels \u00e0 notre responsable de la protection de la vie priv\u00e9e \u00e0 l\u2019adresse privacy@wolfwhale.ca.`,
      },
      {
        id: 'provincial-compliance',
        heading: '6. Conformit\u00e9 aux lois provinciales',
        body: `En plus de la LPRPDE, WolfWhale se conforme aux lois provinciales applicables en mati\u00e8re de protection des renseignements personnels \u00e0 travers le Canada\u00a0:

**Colombie-Britannique \u2014 Freedom of Information and Protection of Privacy Act (FIPPA)**
Lorsque nous fournissons des services \u00e0 des organismes publics en Colombie-Britannique, nous veillons \u00e0 ce que les renseignements personnels soient stock\u00e9s et consult\u00e9s uniquement au Canada, sauf si la communication \u00e0 l\u2019ext\u00e9rieur du Canada est autoris\u00e9e. Nous collaborons avec les organismes publics pour les aider \u00e0 remplir leurs obligations en vertu de la FIPPA, y compris en r\u00e9pondant aux demandes d\u2019acc\u00e8s et en assurant un traitement ad\u00e9quat des donn\u00e9es.

**Ontario \u2014 Loi sur l\u2019acc\u00e8s \u00e0 l\u2019information municipale et la protection de la vie priv\u00e9e (LAIMPVP/MFIPPA)**
Pour les conseils scolaires de l\u2019Ontario, nous respectons les exigences de la LAIMPVP concernant la collecte, l\u2019utilisation, la conservation et la communication des renseignements personnels. Nous aidons les conseils scolaires \u00e0 remplir leurs obligations en mati\u00e8re d\u2019avis et d\u2019acc\u00e8s et nous maintenons des ententes de traitement des donn\u00e9es ad\u00e9quates.

**Qu\u00e9bec \u2014 Loi sur la protection des renseignements personnels dans le secteur priv\u00e9 (Loi\u00a025)**
WolfWhale se conforme \u00e0 la Loi\u00a025 du Qu\u00e9bec, notamment\u00a0:
\u2022 R\u00e9alisation d\u2019\u00e9valuations des facteurs relatifs \u00e0 la vie priv\u00e9e (\u00c9FVP) pour tout projet impliquant la collecte, l\u2019utilisation ou la communication de renseignements personnels
\u2022 D\u00e9signation d\u2019un responsable de la protection des renseignements personnels
\u2022 Mise en \u0153uvre d\u2019un cadre de gouvernance des renseignements personnels
\u2022 Tenue d\u2019un registre des incidents de confidentialit\u00e9 et signalement \u00e0 la Commission d\u2019acc\u00e8s \u00e0 l\u2019information du Qu\u00e9bec (CAI) de tout incident de confidentialit\u00e9 pr\u00e9sentant un risque de pr\u00e9judice s\u00e9rieux
\u2022 R\u00e9daction des politiques de confidentialit\u00e9 en termes clairs et simples
\u2022 Obtention du consentement de mani\u00e8re manifeste, libre et \u00e9clair\u00e9e
\u2022 Mise en \u0153uvre du droit \u00e0 la portabilit\u00e9 des donn\u00e9es dans un format technologique structur\u00e9 et couramment utilis\u00e9

**Alberta \u2014 Freedom of Information and Protection of Privacy Act (FOIP)**
Lorsque nous desservons des \u00e9tablissements d\u2019enseignement albertains, nous nous conformons aux exigences de la FOIP Act, y compris en veillant \u00e0 ce que les renseignements personnels soient recueillis en vertu de l\u2019autorit\u00e9 comp\u00e9tente, utilis\u00e9s uniquement aux fins pour lesquelles ils ont \u00e9t\u00e9 recueillis et prot\u00e9g\u00e9s par des mesures de s\u00e9curit\u00e9 raisonnables. Nous aidons les \u00e9tablissements \u00e0 r\u00e9aliser les \u00e9valuations des facteurs relatifs \u00e0 la vie priv\u00e9e requises en vertu de la FOIP.`,
      },
      {
        id: 'parental-rights',
        heading: '7. Droits parentaux',
        body: `Nous reconnaissons les protections particuli\u00e8res requises pour les renseignements personnels des enfants dans le contexte \u00e9ducatif.

**Consentement pour les mineurs**
Pour les \u00e9l\u00e8ves de moins de 13 ans, nous exigeons le consentement v\u00e9rifiable d\u2019un parent ou d\u2019un tuteur avant de recueillir des renseignements personnels, conform\u00e9ment aux pratiques exemplaires et aux lois applicables. Pour les \u00e9l\u00e8ves de 13 ans et plus, mais n\u2019ayant pas atteint l\u2019\u00e2ge de la majorit\u00e9 dans leur province (g\u00e9n\u00e9ralement 18 ou 19 ans), les \u00e9coles fournissent g\u00e9n\u00e9ralement le consentement au nom des parents dans le cadre de la relation \u00e9ducative, bien que les parents conservent le droit de consulter les renseignements et de s\u2019y opposer.

**Droit d\u2019acc\u00e8s**
Les parents et tuteurs ont le droit de\u00a0:
\u2022 Consulter les renseignements personnels recueillis au sujet de leur enfant
\u2022 Demander une copie des dossiers scolaires de leur enfant stock\u00e9s sur la plateforme
\u2022 Consulter les notes, les pr\u00e9sences, les travaux remis et l\u2019activit\u00e9 de leur enfant par l\u2019interm\u00e9diaire du Portail des parents

**Droit au consentement et au retrait**
Les parents et tuteurs peuvent\u00a0:
\u2022 Accorder ou refuser le consentement \u00e0 la collecte et \u00e0 l\u2019utilisation des renseignements de leur enfant
\u2022 Retirer un consentement pr\u00e9c\u00e9demment donn\u00e9 en communiquant avec l\u2019\u00e9cole ou WolfWhale directement
\u2022 Demander que nous cessions de recueillir ou d\u2019utiliser les renseignements de leur enfant \u00e0 l\u2019avenir

**Droit \u00e0 la suppression**
Les parents et tuteurs peuvent demander la suppression des renseignements personnels de leur enfant. Les demandes de suppression sont trait\u00e9es en coordination avec l\u2019\u00e9cole, car certains dossiers pourraient devoir \u00eatre conserv\u00e9s \u00e0 des fins \u00e9ducatives ou r\u00e9glementaires l\u00e9gitimes. Consultez la section\u00a011 pour plus de d\u00e9tails sur le processus de suppression.

**Exercice des droits parentaux**
Les parents peuvent exercer ces droits en communiquant avec l\u2019administrateur de leur \u00e9cole ou en nous contactant directement \u00e0 l\u2019adresse privacy@wolfwhale.ca. Nous v\u00e9rifierons l\u2019identit\u00e9 du demandeur avant de traiter toute demande.`,
      },
      {
        id: 'data-storage-security',
        heading: '8. Stockage des donn\u00e9es et s\u00e9curit\u00e9',
        body: `Nous mettons en \u0153uvre des mesures de s\u00e9curit\u00e9 compl\u00e8tes pour prot\u00e9ger les renseignements personnels\u00a0:

**Infrastructure**
\u2022 Toutes les donn\u00e9es sont stock\u00e9es sur Supabase, une plateforme de base de donn\u00e9es s\u00e9curis\u00e9e de classe entreprise fond\u00e9e sur PostgreSQL
\u2022 L\u2019application est h\u00e9berg\u00e9e sur le r\u00e9seau p\u00e9riph\u00e9rique de Vercel avec protection contre les attaques DDoS et SSL automatique
\u2022 L\u2019infrastructure de base de donn\u00e9es comprend des sauvegardes automatis\u00e9es, la r\u00e9cup\u00e9ration ponctuelle et la haute disponibilit\u00e9

**Chiffrement**
\u2022 Toutes les donn\u00e9es sont chiffr\u00e9es au repos avec le chiffrement AES-256
\u2022 Toutes les donn\u00e9es en transit sont chiffr\u00e9es au moyen de TLS 1.2 ou version sup\u00e9rieure
\u2022 Les connexions \u00e0 la base de donn\u00e9es utilisent le chiffrement SSL/TLS

**Contr\u00f4les d\u2019acc\u00e8s**
\u2022 La s\u00e9curit\u00e9 au niveau des lignes (RLS) dans PostgreSQL garantit que les utilisateurs n\u2019ont acc\u00e8s qu\u2019aux donn\u00e9es qu\u2019ils sont autoris\u00e9s \u00e0 consulter
\u2022 Le contr\u00f4le d\u2019acc\u00e8s fond\u00e9 sur les r\u00f4les (RBAC) restreint les fonctionnalit\u00e9s de la plateforme selon les r\u00f4les des utilisateurs (\u00e9l\u00e8ve, enseignant, administrateur, parent)
\u2022 L\u2019architecture multi-locataire assure une isolation compl\u00e8te des donn\u00e9es entre les \u00e9coles
\u2022 L\u2019acc\u00e8s administratif aux syst\u00e8mes de production est restreint et journalis\u00e9

**Surveillance et audit**
\u2022 La journalisation compl\u00e8te des audits suit tous les acc\u00e8s aux donn\u00e9es et les modifications
\u2022 La surveillance automatis\u00e9e d\u00e9tecte et signale toute activit\u00e9 anormale
\u2022 Des examens de s\u00e9curit\u00e9 et des \u00e9valuations de vuln\u00e9rabilit\u00e9 sont r\u00e9alis\u00e9s r\u00e9guli\u00e8rement

**Emplacement des donn\u00e9es**
Les donn\u00e9es peuvent \u00eatre stock\u00e9es et trait\u00e9es au Canada et/ou aux \u00c9tats-Unis par l\u2019interm\u00e9diaire de nos fournisseurs d\u2019infrastructure (Supabase et Vercel). Pour les \u00e9tablissements exigeant la r\u00e9sidence des donn\u00e9es au Canada, nous offrons des configurations garantissant que les donn\u00e9es demeurent sur le territoire canadien.`,
      },
      {
        id: 'data-retention',
        heading: '9. Conservation des donn\u00e9es',
        body: `Nous conservons les renseignements personnels uniquement le temps n\u00e9cessaire \u00e0 la r\u00e9alisation des fins \u00e9ducatives pour lesquelles ils ont \u00e9t\u00e9 recueillis et au respect de nos obligations l\u00e9gales.

**Inscription active**
Pendant qu\u2019un \u00e9l\u00e8ve est activement inscrit et utilise la plateforme, nous conservons tous les dossiers scolaires n\u00e9cessaires aux activit\u00e9s \u00e9ducatives en cours de l\u2019\u00e9cole, y compris les notes, les registres de pr\u00e9sence, les travaux remis et la progression dans les cours.

**Apr\u00e8s l\u2019inscription**
Apr\u00e8s la fin de l\u2019inscription d\u2019un \u00e9l\u00e8ve ou la conclusion du contrat de l\u2019\u00e9cole avec WolfWhale\u00a0:
\u2022 Les dossiers scolaires sont conserv\u00e9s pendant une p\u00e9riode raisonnable (g\u00e9n\u00e9ralement la fin de l\u2019ann\u00e9e scolaire en cours plus une ann\u00e9e suppl\u00e9mentaire) pour permettre les demandes de relev\u00e9s de notes, le suivi administratif et la r\u00e9solution de litiges
\u2022 Les \u00e9coles peuvent demander une suppression anticip\u00e9e ou une conservation prolong\u00e9e en fonction de leurs politiques institutionnelles et exigences l\u00e9gales
\u2022 L\u2019acc\u00e8s au compte est d\u00e9sactiv\u00e9 rapidement sur notification de l\u2019\u00e9cole

**Donn\u00e9es anonymis\u00e9es**
Nous pouvons conserver des donn\u00e9es anonymis\u00e9es et agr\u00e9g\u00e9es ne permettant plus d\u2019identifier une personne afin d\u2019am\u00e9liorer notre plateforme et de produire des analyses statistiques. Ces donn\u00e9es ne sont pas vis\u00e9es par les demandes de suppression puisqu\u2019elles ne constituent plus des renseignements personnels.

**Conservation r\u00e9glementaire**
Certains dossiers peuvent \u00eatre conserv\u00e9s plus longtemps si la loi ou la r\u00e9glementation applicable l\u2019exige, ou s\u2019ils sont n\u00e9cessaires \u00e0 la constatation, \u00e0 l\u2019exercice ou \u00e0 la d\u00e9fense de droits en justice.`,
      },
      {
        id: 'data-portability',
        heading: '10. Portabilit\u00e9 des donn\u00e9es',
        body: `Les utilisateurs ont le droit de demander une copie de leurs renseignements personnels dans un format structur\u00e9, couramment utilis\u00e9 et lisible par machine.

**Donn\u00e9es exportables**
\u2022 Dossiers des \u00e9l\u00e8ves\u00a0: notes, historique des pr\u00e9sences, travaux remis, historique d\u2019inscription aux cours
\u2022 Dossiers des enseignants\u00a0: contenu des cours, donn\u00e9es du carnet de notes, registres de pr\u00e9sence
\u2022 Dossiers des parents\u00a0: renseignements des \u00e9l\u00e8ves li\u00e9s visibles par le Portail des parents
\u2022 Renseignements du compte\u00a0: donn\u00e9es de profil, coordonn\u00e9es

**Comment demander une exportation**
\u2022 Les administrateurs scolaires peuvent g\u00e9n\u00e9rer des exportations de donn\u00e9es par le biais du tableau de bord administratif
\u2022 Les utilisateurs individuels ou les parents peuvent soumettre une demande de portabilit\u00e9 des donn\u00e9es \u00e0 privacy@wolfwhale.ca
\u2022 Les demandes sont trait\u00e9es dans un d\u00e9lai de 30 jours suivant la r\u00e9ception

**Formats d\u2019exportation**
Les exportations de donn\u00e9es sont fournies dans des formats standards tels que CSV, JSON ou PDF, selon la nature des donn\u00e9es. Nous collaborons avec les \u00e9tablissements pour assurer la compatibilit\u00e9 des exportations avec d\u2019autres syst\u00e8mes lorsque cela est possible.`,
      },
      {
        id: 'data-deletion',
        heading: '11. Suppression des donn\u00e9es',
        body: `Les utilisateurs, les parents et les administrateurs scolaires ont le droit de demander la suppression de renseignements personnels.

**Comment demander une suppression**
\u2022 Communiquez avec nous \u00e0 privacy@wolfwhale.ca pour soumettre une demande de suppression
\u2022 Les administrateurs scolaires peuvent initier la suppression par le biais du tableau de bord administratif
\u2022 Les parents peuvent demander la suppression des donn\u00e9es de leur enfant en communiquant avec l\u2019\u00e9cole ou WolfWhale directement

**D\u00e9lai de traitement**
\u2022 Les demandes de suppression font l\u2019objet d\u2019un accus\u00e9 de r\u00e9ception dans les 5 jours ouvrables
\u2022 La suppression est effectu\u00e9e dans les 30 jours civils suivant la demande
\u2022 Nous confirmerons la suppression par \u00e9crit une fois le traitement termin\u00e9

**Port\u00e9e de la suppression**
\u00c0 la suite d\u2019une demande de suppression valide, nous supprimerons ou d\u00e9personnaliserons\u00a0:
\u2022 Les renseignements de compte et les donn\u00e9es de profil
\u2022 Les dossiers scolaires, y compris les notes, les pr\u00e9sences et les travaux remis
\u2022 Les messages et les communications stock\u00e9s sur la plateforme
\u2022 Les journaux d\u2019utilisation et d\u2019activit\u00e9 associ\u00e9s au compte

**Exceptions**
Certains renseignements peuvent \u00eatre conserv\u00e9s apr\u00e8s une demande de suppression dans les cas suivants\u00a0:
\u2022 La conservation est exig\u00e9e par la loi ou la r\u00e9glementation applicable
\u2022 La conservation est n\u00e9cessaire \u00e0 la constatation, \u00e0 l\u2019exercice ou \u00e0 la d\u00e9fense de droits en justice
\u2022 L\u2019\u00e9cole nous a demand\u00e9 de conserver les dossiers \u00e0 des fins \u00e9ducatives ou administratives l\u00e9gitimes
\u2022 Les donn\u00e9es ont \u00e9t\u00e9 enti\u00e8rement anonymis\u00e9es et ne permettent plus d\u2019identifier une personne

Nous informerons le demandeur de tout renseignement qui ne peut \u00eatre supprim\u00e9 ainsi que du fondement juridique de sa conservation.`,
      },
      {
        id: 'breach-notification',
        heading: '12. Avis en cas d\u2019atteinte',
        body: `En cas d\u2019atteinte \u00e0 la s\u00e9curit\u00e9 impliquant des renseignements personnels, nous suivons un protocole rigoureux de r\u00e9ponse aux incidents.

**Signalement au Commissaire \u00e0 la protection de la vie priv\u00e9e**
Nous signalerons toute atteinte aux mesures de s\u00e9curit\u00e9 impliquant des renseignements personnels et cr\u00e9ant un risque r\u00e9el de pr\u00e9judice grave au Commissariat \u00e0 la protection de la vie priv\u00e9e du Canada dans les 72 heures suivant la d\u00e9couverte de l\u2019atteinte, conform\u00e9ment \u00e0 la LPRPDE.

**Avis aux personnes concern\u00e9es**
\u2022 Nous aviserons les personnes concern\u00e9es et l\u2019\u00e9cole pertinente d\u00e8s que possible apr\u00e8s la d\u00e9couverte de l\u2019atteinte
\u2022 Les avis comprendront une description de l\u2019incident, les types de renseignements en cause, les mesures que nous avons prises pour rem\u00e9dier \u00e0 l\u2019atteinte et les mesures recommand\u00e9es pour les personnes concern\u00e9es
\u2022 Pour les \u00e9tablissements qu\u00e9b\u00e9cois, nous aviserons \u00e9galement la Commission d\u2019acc\u00e8s \u00e0 l\u2019information du Qu\u00e9bec (CAI) de tout incident de confidentialit\u00e9 pr\u00e9sentant un risque de pr\u00e9judice s\u00e9rieux

**Signalement provincial**
Nous respectons les exigences provinciales en mati\u00e8re de signalement des atteintes, y compris celles pr\u00e9vues par la PIPA de l\u2019Alberta, la Loi\u00a025 du Qu\u00e9bec et toute autre loi provinciale applicable.

**Registre des incidents**
Nous tenons un registre de tous les incidents de s\u00e9curit\u00e9 impliquant des renseignements personnels, y compris ceux qui n\u2019atteignent pas le seuil de signalement, tel qu\u2019exig\u00e9 par la LPRPDE et la Loi\u00a025 du Qu\u00e9bec.

**Att\u00e9nuation**
D\u00e8s la d\u00e9couverte d\u2019une atteinte, nous prenons imm\u00e9diatement des mesures pour contenir l\u2019incident, \u00e9valuer l\u2019\u00e9tendue de l\u2019impact, att\u00e9nuer les pr\u00e9judices potentiels et mettre en \u0153uvre des mesures pour pr\u00e9venir toute r\u00e9currence.`,
      },
      {
        id: 'third-party-services',
        heading: '13. Services tiers',
        body: `WolfWhale fait appel \u00e0 un nombre limit\u00e9 de fournisseurs de services tiers pour la prestation et l\u2019h\u00e9bergement de la plateforme. Nous \u00e9valuons rigoureusement chaque fournisseur en mati\u00e8re de conformit\u00e9 \u00e0 la vie priv\u00e9e et \u00e0 la s\u00e9curit\u00e9.

**Supabase** (Base de donn\u00e9es et authentification)
\u2022 Fournit l\u2019h\u00e9bergement de la base de donn\u00e9es PostgreSQL, l\u2019authentification des utilisateurs et les fonctionnalit\u00e9s en temps r\u00e9el
\u2022 Les donn\u00e9es sont chiffr\u00e9es au repos et en transit
\u2022 Conforme SOC 2 Type II
\u2022 En savoir plus\u00a0: https://supabase.com/privacy

**Vercel** (H\u00e9bergement de l\u2019application)
\u2022 H\u00e9berge l\u2019application Web WolfWhale et fournit l\u2019informatique p\u00e9riph\u00e9rique, le CDN et le SSL
\u2022 Conforme SOC 2 Type II
\u2022 En savoir plus\u00a0: https://vercel.com/legal/privacy-policy

**Ce que nous ne faisons pas**
\u2022 Nous ne partageons pas les donn\u00e9es des \u00e9l\u00e8ves avec des annonceurs, des courtiers en donn\u00e9es ou des soci\u00e9t\u00e9s de marketing
\u2022 Nous n\u2019int\u00e9grons pas de publicit\u00e9s ni de pixels de suivi tiers sur la plateforme
\u2022 Nous n\u2019utilisons pas les donn\u00e9es des \u00e9l\u00e8ves \u00e0 des fins commerciales autres que la prestation du service \u00e9ducatif
\u2022 Nous n\u2019autorisons pas les fournisseurs tiers \u00e0 utiliser les donn\u00e9es des \u00e9l\u00e8ves pour leurs propres fins

Tous les fournisseurs tiers sont contractuellement tenus de traiter les renseignements personnels conform\u00e9ment \u00e0 nos normes de confidentialit\u00e9 et aux lois canadiennes applicables en mati\u00e8re de protection de la vie priv\u00e9e.`,
      },
      {
        id: 'contact',
        heading: '14. Coordonn\u00e9es',
        body: `Si vous avez des questions, des pr\u00e9occupations ou des demandes concernant la pr\u00e9sente Politique de confidentialit\u00e9 ou nos pratiques en mati\u00e8re de donn\u00e9es, veuillez communiquer avec nous\u00a0:

**Responsable de la protection de la vie priv\u00e9e**
WolfWhale LMS
Courriel\u00a0: privacy@wolfwhale.ca
T\u00e9l\u00e9phone\u00a0: +1 (306) 981-5926

**D\u00e9lais de r\u00e9ponse**
\u2022 Demandes g\u00e9n\u00e9rales\u00a0: dans les 10 jours ouvrables
\u2022 Demandes d\u2019acc\u00e8s\u00a0: dans les 30 jours civils
\u2022 Demandes de suppression\u00a0: accus\u00e9 de r\u00e9ception dans les 5 jours ouvrables, traitement dans les 30 jours civils
\u2022 Pr\u00e9occupations urgentes en mati\u00e8re de vie priv\u00e9e\u00a0: dans les 48 heures

**D\u00e9poser une plainte**
Si vous n\u2019\u00eates pas satisfait de notre r\u00e9ponse, vous avez le droit de d\u00e9poser une plainte aupr\u00e8s de\u00a0:
\u2022 Le Commissariat \u00e0 la protection de la vie priv\u00e9e du Canada (www.priv.gc.ca)
\u2022 Le commissaire \u00e0 la protection de la vie priv\u00e9e de votre province ou l\u2019autorit\u00e9 comp\u00e9tente en mati\u00e8re d\u2019acc\u00e8s \u00e0 l\u2019information
\u2022 Au Qu\u00e9bec\u00a0: la Commission d\u2019acc\u00e8s \u00e0 l\u2019information du Qu\u00e9bec (www.cai.gouv.qc.ca)`,
      },
      {
        id: 'updates',
        heading: '15. Modifications \u00e0 la pr\u00e9sente Politique de confidentialit\u00e9',
        body: `Nous pouvons mettre \u00e0 jour la pr\u00e9sente Politique de confidentialit\u00e9 p\u00e9riodiquement afin de tenir compte des changements dans nos pratiques, nos technologies, les exigences l\u00e9gales ou d\u2019autres facteurs.

**Comment nous vous informons**
\u2022 Les modifications importantes seront communiqu\u00e9es par un avis sur la plateforme et/ou par courriel aux administrateurs scolaires
\u2022 La date de \u00ab\u00a0Derni\u00e8re mise \u00e0 jour\u00a0\u00bb en haut de la pr\u00e9sente politique sera r\u00e9vis\u00e9e
\u2022 Pour les modifications importantes touchant les donn\u00e9es des \u00e9l\u00e8ves, nous donnerons un pr\u00e9avis d\u2019au moins 30 jours

**Utilisation continue**
L\u2019utilisation continue de WolfWhale LMS apr\u00e8s les modifications apport\u00e9es \u00e0 la pr\u00e9sente Politique de confidentialit\u00e9 vaut acceptation des modalit\u00e9s r\u00e9vis\u00e9es. Si vous n\u2019\u00eates pas d\u2019accord avec les modifications, vous devriez cesser l\u2019utilisation de la plateforme et communiquer avec nous pour discuter de vos pr\u00e9occupations.

**Versions ant\u00e9rieures**
Les versions ant\u00e9rieures de la pr\u00e9sente Politique de confidentialit\u00e9 sont disponibles sur demande en communiquant avec privacy@wolfwhale.ca.`,
      },
    ],
  },
}

function renderMarkdown(text: string) {
  const paragraphs = text.split('\n\n')

  return paragraphs.map((paragraph, pIdx) => {
    if (paragraph.includes('\n\u2022')) {
      const lines = paragraph.split('\n').filter(Boolean)
      const intro = lines[0].startsWith('\u2022') ? null : lines[0]
      const items = lines.filter((l) => l.startsWith('\u2022'))

      return (
        <div key={`p-${pIdx}`} className="mb-4">
          {intro && (
            <p className="mb-2 text-gray-600 dark:text-white/70" dangerouslySetInnerHTML={{ __html: formatInline(intro) }} />
          )}
          <ul className="space-y-1.5 ml-1">
            {items.map((item, iIdx) => (
              <li key={`p-${pIdx}-li-${iIdx}`} className="flex items-start gap-2 text-gray-600 dark:text-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-white/40 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: formatInline(item.slice(2)) }} />
              </li>
            ))}
          </ul>
        </div>
      )
    }

    if (paragraph.startsWith('\u2022')) {
      const items = paragraph.split('\n').filter(Boolean)
      return (
        <ul key={`p-${pIdx}`} className="space-y-1.5 ml-1 mb-4">
          {items.map((item, iIdx) => (
            <li key={`p-${pIdx}-li-${iIdx}`} className="flex items-start gap-2 text-gray-600 dark:text-white/70">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-white/40 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item.slice(2)) }} />
            </li>
          ))}
        </ul>
      )
    }

    return (
      <p
        key={`p-${pIdx}`}
        className="mb-4 text-gray-600 dark:text-white/70 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }}
      />
    )
  })
}

function formatInline(text: string): string {
  let result = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white font-semibold">$1</strong>')
  result = result.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-gray-900 dark:text-white underline hover:opacity-70 transition-opacity">$1</a>'
  )
  result = result.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1" class="text-gray-900 dark:text-white underline hover:opacity-70 transition-opacity">$1</a>'
  )
  return result
}

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

export default async function PrivacyPolicyPage({ searchParams }: PageProps) {
  const params = await searchParams
  const lang: Lang = params.lang === 'fr' ? 'fr' : 'en'
  const t = content[lang]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="WolfWhale" width={48} height={48} sizes="48px" className="rounded-xl object-contain shadow-lg border-2 border-black dark:border-white/10" />
            <div>
              <h1 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white group-hover:opacity-70 transition-opacity tracking-wider uppercase">
                WolfWhale
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/50 font-display font-semibold tracking-widest uppercase">Learning Management System</p>
            </div>
          </Link>

          {/* Language Toggle (client component) */}
          <LanguageToggle lang={lang} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToHome}
        </Link>

        {/* Title Block */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white">{t.title}</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-white/70 mb-2">{t.subtitle}</p>
          <p className="text-sm text-gray-500 dark:text-white/40">{t.lastUpdated}</p>
        </div>

        {/* Table of Contents */}
        <nav className="rounded-2xl p-5 sm:p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-10 sm:mb-12">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider mb-4">
            {lang === 'en' ? 'Table of Contents' : 'Table des mati\u00e8res'}
          </h2>
          <ol className="space-y-1.5">
            {t.sections.map((section) => (
              <li key={`toc-${section.id}`}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors block py-0.5"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-10 sm:space-y-12">
          {t.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3">
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
      <footer className="border-t border-gray-200 dark:border-white/5 mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 dark:text-white/30">
              &copy; 2026 WolfWhale LMS. {lang === 'en' ? 'All rights reserved.' : 'Tous droits r\u00e9serv\u00e9s.'}
            </p>
            <div className="flex gap-6">
              <Link
                href={`/privacy?lang=${lang}`}
                className="text-sm text-gray-900 dark:text-white font-medium"
              >
                {lang === 'en' ? 'Privacy' : 'Confidentialit\u00e9'}
              </Link>
              <Link
                href={`/terms?lang=${lang}`}
                className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {lang === 'en' ? 'Terms' : 'Conditions'}
              </Link>
              <Link
                href={`/help?lang=${lang}`}
                className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
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
