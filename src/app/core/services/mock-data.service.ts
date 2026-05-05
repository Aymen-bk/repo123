import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly companies: Company[] = [
    {
      company_id: '1',
      company_name: 'Apple Inc.',
      company_ticker: 'AAPL',
      country: 'United States',
      head_quarter_iso_2_code: 'US',
      industry: 'Information Technology',
      company_type: 'public',
      website: 'https://www.apple.com',
      investor_website: 'https://investor.apple.com',
      company_logo: null,
      Source: 'Humankind V2',
      status: 'success',
      is_current: true,
      timestamp: '2025-11-20T22:02:48.145',
      humankind_response: {
        global_score: 82.48,
        processing_time: 11200.14,
        category_details: [
          {
            category: 'Governance',
            average_score: 74.78,
            level_2_metrics: [
              {
                metric_name: 'Corruption Or Bribery Convictions',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Number Of Corruption Or Bribery Convictions', score: 100, sources: ['https://investor.apple.com'], user_friendly_explanation: ['Apple has a perfect score in this area. Their reports mention no instances of corruption or bribery convictions, indicating strong ethical standards and governance.'], information: [], score_explanation_english: ['0 convictions reported = 100 score.'], score_explanation_french: ['0 condamnations signalées = score de 100.'] },
                  { metric_name: 'Total Amount Of Fines Incurred', score: 100, sources: [], user_friendly_explanation: ['Apple did not report any monetary fines for breaking laws or regulations during fiscal year 2024.'], information: [], score_explanation_english: ['Fines represent 0% of revenue = 100.'], score_explanation_french: ['Les amendes représentent 0% du CA = 100.'] },
                ],
              },
              {
                metric_name: 'Gender Diversity',
                average_score: 73,
                level_3_metrics: [
                  { metric_name: 'Gender Diversity At Board And Executive Level', score: 73, sources: ['https://investor.apple.com/leadership-and-governance/default.aspx'], user_friendly_explanation: ['Apple shows strong gender diversity at board level — 4 of 8 board members are women (50%). Executive level diversity is still improving.'], information: ['Board: 4 women / 4 men. 20 senior executives, at least 1 female VP.'], score_explanation_english: ['Board women = 50% → 33.3pts; Executive women >5% → 15pts; Strong policy → 25pts; Total = 73.'], score_explanation_french: ['Femmes au CA = 50% → 33,3pts; Direction ≥5% → 15pts; Politique forte → 25pts; Total = 73.'] },
                ],
              },
              {
                metric_name: 'Whistleblower',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Whistleblower Protections And Complaint Mechanisms', score: 100, sources: [], user_friendly_explanation: ['Apple has a robust whistleblower protection system enabling factory workers and partners to safely report concerns.'], information: [], score_explanation_english: ['Full protections and mechanisms in place = 100.'], score_explanation_french: ['Protections complètes en place = 100.'] },
                ],
              },
              {
                metric_name: 'Data Security',
                average_score: 50,
                level_3_metrics: [
                  { metric_name: 'Data Security', score: 50, sources: [], user_friendly_explanation: ['Apple takes data security seriously with device-level encryption and privacy features built in. However, the score reflects gaps in external reporting on breach incidents.'], information: [], score_explanation_english: ['Strong practices but limited public quantitative disclosure = 50.'], score_explanation_french: ['Bonnes pratiques mais divulgation quantitative limitée = 50.'] },
                ],
              },
              {
                metric_name: 'Data Privacy',
                average_score: 50,
                level_3_metrics: [
                  { metric_name: 'Data Privacy', score: 50, sources: [], user_friendly_explanation: ['Apple builds privacy directly into its products. However, specific privacy incident reporting and metrics disclosure are limited.'], information: [], score_explanation_english: ['Good framework, limited quantitative metrics = 50.'], score_explanation_french: ['Bon cadre, métriques quantitatives limitées = 50.'] },
                ],
              },
              {
                metric_name: 'Supplier Engagement And Monitoring',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Supplier Engagement And Monitoring', score: 100, sources: [], user_friendly_explanation: ['Apple is a leader in supplier accountability. Over 893 supply chain assessments were conducted in 2024 with no forced labor found.'], information: [], score_explanation_english: ['Comprehensive monitoring, transparent reporting = 100.'], score_explanation_french: ['Surveillance complète, reporting transparent = 100.'] },
                ],
              },
              {
                metric_name: 'ESG Oversight And Management',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Board Oversight And Management Of ESG Topics', score: 100, sources: [], user_friendly_explanation: ['Apple has top-tier ESG board oversight with dedicated committees and executive accountability for sustainability.'], information: [], score_explanation_english: ['Full board ESG oversight with committee = 100.'], score_explanation_french: ['Surveillance ESG complète avec comité = 100.'] },
                ],
              },
              {
                metric_name: 'Ethical Marketing And Marketing Practices',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Ethical Marketing And Marketing Practices', score: 100, sources: [], user_friendly_explanation: ['Apple excels in honest advertising and commits to transparent environmental claims without greenwashing.'], information: [], score_explanation_english: ['No misleading claims, strong ethics policy = 100.'], score_explanation_french: ['Aucune allégation trompeuse, politique éthique forte = 100.'] },
                ],
              },
              {
                metric_name: 'Financed Emissions',
                average_score: 0,
                level_3_metrics: [
                  { metric_name: 'Financed Emissions', score: 0, sources: [], user_friendly_explanation: ['Apple does not report emissions from its investment portfolio. This absence of disclosure results in a score of 0 for this metric.'], information: [], score_explanation_english: ['No financed emissions disclosure = 0.'], score_explanation_french: ['Pas de divulgation des émissions financées = 0.'] },
                ],
              },
            ],
          },
          {
            category: 'People',
            average_score: 74.96,
            level_2_metrics: [
              {
                metric_name: 'Sustainable Economy',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Practices Policies And Future Initiatives For Transitioning Towards A More Sustainable Economy', score: 100, sources: [], user_friendly_explanation: ['Apple is making comprehensive efforts toward sustainability with clear plans spanning energy, materials, and supply chain.'], information: [], score_explanation_english: ['Comprehensive sustainable economy strategy = 100.'], score_explanation_french: ['Stratégie économie durable complète = 100.'] },
                ],
              },
              {
                metric_name: 'Workforce Characteristics',
                average_score: 50,
                level_3_metrics: [
                  { metric_name: 'Gender Breakdown', score: 100, sources: [], user_friendly_explanation: ['Apple openly shares detailed gender makeup of its US workforce, showing transparent reporting on diversity.'], information: [], score_explanation_english: ['Full gender breakdown disclosure = 100.'], score_explanation_french: ['Divulgation complète de la répartition par genre = 100.'] },
                  { metric_name: 'Employee Turnover Rate', score: null, sources: [], user_friendly_explanation: ['No turnover rate data available — Apple has not disclosed this metric publicly.'], information: [], score_explanation_english: ['Not disclosed = null.'], score_explanation_french: ['Non divulgué = null.'] },
                ],
              },
              {
                metric_name: 'Health And Safety',
                average_score: 41.67,
                level_3_metrics: [
                  { metric_name: 'Work Related Accident Rate', score: 25, sources: [], user_friendly_explanation: ['Apple reports safe working conditions but accident rate metrics show room for improvement vs industry best practices.'], information: [], score_explanation_english: ['Accident rate above benchmark = 25.'], score_explanation_french: ['Taux d\'accident supérieur au benchmark = 25.'] },
                  { metric_name: 'Number Of Work Related Fatalities', score: null, sources: [], user_friendly_explanation: ['Apple has not publicly disclosed the number of work-related fatalities in its operations.'], information: [], score_explanation_english: ['Not disclosed = null.'], score_explanation_french: ['Non divulgué = null.'] },
                  { metric_name: 'Health And Safety Management System', score: 100, sources: [], user_friendly_explanation: ['Apple has a certified, comprehensive health and safety management system for its operations and supply chain.'], information: [], score_explanation_english: ['Certified H&S management system in place = 100.'], score_explanation_french: ['Système de gestion H&S certifié = 100.'] },
                ],
              },
              {
                metric_name: 'Workforce Remuneration',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Gender Pay Gap', score: 100, sources: [], user_friendly_explanation: ['Apple has achieved equal pay since 2017 and maintains it consistently across its global workforce.'], information: [], score_explanation_english: ['Equal pay achieved and maintained = 100.'], score_explanation_french: ['Égalité de rémunération atteinte et maintenue = 100.'] },
                  { metric_name: 'Average Training Hours Per Employee', score: 100, sources: [], user_friendly_explanation: ['Apple provides extensive training programs exceeding industry benchmarks for employees and supply chain workers.'], information: [], score_explanation_english: ['Training hours exceed benchmark = 100.'], score_explanation_french: ['Heures de formation supérieures au benchmark = 100.'] },
                ],
              },
              {
                metric_name: 'Workforce Characteristics Additional',
                average_score: 75,
                level_3_metrics: [
                  { metric_name: 'Female To Male Ratio At Management Level', score: 75, sources: [], user_friendly_explanation: ['35% of Apple\'s global leadership positions are held by women — above average but below the 40% target.'], information: [], score_explanation_english: ['35% women in management = 75.'], score_explanation_french: ['35% de femmes dans le management = 75.'] },
                ],
              },
              {
                metric_name: 'Human Rights',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Human Rights Policies And Processes', score: 100, sources: [], user_friendly_explanation: ['Apple has comprehensive human rights policies covering its own operations and all suppliers with mandatory compliance.'], information: [], score_explanation_english: ['Comprehensive HR policy with supplier requirements = 100.'], score_explanation_french: ['Politique DH complète avec exigences fournisseurs = 100.'] },
                ],
              },
              {
                metric_name: 'Human Rights Violations',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Confirmed Human Rights Violations', score: 100, sources: [], user_friendly_explanation: ['No confirmed human rights violations found in Apple\'s supply chain in 2024 after over 893 assessments.'], information: [], score_explanation_english: ['0 violations confirmed = 100.'], score_explanation_french: ['0 violation confirmée = 100.'] },
                ],
              },
              {
                metric_name: 'Product Safety',
                average_score: 8,
                level_3_metrics: [
                  { metric_name: 'Product Safety', score: 8, sources: [], user_friendly_explanation: ['Despite Apple\'s strong internal testing, limited public quantitative data on product recalls or safety incidents results in a low score.'], information: [], score_explanation_english: ['Limited safety incident disclosure = 8.'], score_explanation_french: ['Divulgation limitée des incidents de sécurité = 8.'] },
                ],
              },
              {
                metric_name: 'Employee Engagement',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Employee Engagement', score: 100, sources: [], user_friendly_explanation: ['Apple actively listens to workers through surveys, feedback programs, and regular assessments across its supply chain.'], information: [], score_explanation_english: ['Comprehensive engagement programs = 100.'], score_explanation_french: ['Programmes d\'engagement complets = 100.'] },
                ],
              },
            ],
          },
          {
            category: 'Planet',
            average_score: 97.71,
            level_2_metrics: [
              {
                metric_name: 'Energy And Greenhouse Gas Emission',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Total Energy Consumption', score: 100, sources: [], user_friendly_explanation: ['Apple provides a detailed picture of its energy use for fiscal 2024, showing total consumption and renewable energy share.'], information: [], score_explanation_english: ['Full energy disclosure with renewable data = 100.'], score_explanation_french: ['Divulgation complète avec données renouvelables = 100.'] },
                  { metric_name: 'Scope 1 Emissions', score: 100, sources: [], user_friendly_explanation: ['Apple fully reports its direct GHG emissions from owned operations with detailed breakdowns.'], information: [], score_explanation_english: ['Complete Scope 1 reporting = 100.'], score_explanation_french: ['Reporting Scope 1 complet = 100.'] },
                  { metric_name: 'Scope 2 Emissions', score: 100, sources: [], user_friendly_explanation: ['Apple thoroughly reports Scope 2 indirect emissions from purchased electricity, heat and cooling.'], information: [], score_explanation_english: ['Complete Scope 2 reporting = 100.'], score_explanation_french: ['Reporting Scope 2 complet = 100.'] },
                ],
              },
              {
                metric_name: 'Pollution Of Air Water And Soil',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Pollution Emissions To Air Water And Soil', score: 100, sources: [], user_friendly_explanation: ['Apple has clear measurable goals to cut pollution and strong controls over hazardous substance usage.'], information: [], score_explanation_english: ['Comprehensive pollution control and disclosure = 100.'], score_explanation_french: ['Contrôle et divulgation pollution complets = 100.'] },
                ],
              },
              {
                metric_name: 'Biodiversity Impact',
                average_score: 90,
                level_3_metrics: [
                  { metric_name: 'Biodiversity Impact Number And Area Of Business Sites Near Sensitive Areas', score: 90, sources: [], user_friendly_explanation: ['Apple actively maps its operations near ecologically sensitive areas and works to protect biodiversity.'], information: [], score_explanation_english: ['Strong biodiversity assessment, minor gaps = 90.'], score_explanation_french: ['Bonne évaluation biodiversité, lacunes mineures = 90.'] },
                ],
              },
              {
                metric_name: 'Water Withdrawal',
                average_score: 94,
                level_3_metrics: [
                  { metric_name: 'Total Water Withdrawal', score: 100, sources: [], user_friendly_explanation: ['Apple is fully transparent about its water usage, showing exact volumes withdrawn and from which sources.'], information: [], score_explanation_english: ['Full water withdrawal disclosure = 100.'], score_explanation_french: ['Divulgation complète prélèvement eau = 100.'] },
                  { metric_name: 'Water Consumption', score: 88, sources: [], user_friendly_explanation: ['Apple measures and reduces water consumption with good precision, very close to best-in-class performance.'], information: [], score_explanation_english: ['Excellent water consumption tracking = 88.'], score_explanation_french: ['Excellent suivi de la consommation d\'eau = 88.'] },
                ],
              },
              {
                metric_name: 'Waste Management',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Circular Economy Principles Usage', score: 100, sources: [], user_friendly_explanation: ['Apple leads circular economy practices, targeting carbon neutrality by 2030 through material reuse.'], information: [], score_explanation_english: ['Leading circular economy programs = 100.'], score_explanation_french: ['Programmes économie circulaire leaders = 100.'] },
                  { metric_name: 'Waste Generation', score: 100, sources: [], user_friendly_explanation: ['Apple provides detailed waste generation numbers with specific diversion rates and recycling data.'], information: [], score_explanation_english: ['Complete waste data with diversion rates = 100.'], score_explanation_french: ['Données déchets complètes avec taux de détournement = 100.'] },
                ],
              },
              {
                metric_name: 'GHG Reduction',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'GHG Reduction Targets Scope 1 And 2 And 3', score: 100, sources: [], user_friendly_explanation: ['Apple aims for carbon neutrality by 2030 across all scopes — one of the most ambitious targets in tech.'], information: [], score_explanation_english: ['Science-based carbon neutrality target by 2030 = 100.'], score_explanation_french: ['Objectif neutralité carbone 2030 aligné science = 100.'] },
                  { metric_name: 'Scope 3 Emissions Reporting', score: 100, sources: [], user_friendly_explanation: ['Apple is fully transparent about all indirect GHG emissions across its entire value chain.'], information: [], score_explanation_english: ['Full Scope 3 reporting across value chain = 100.'], score_explanation_french: ['Reporting Scope 3 complet sur toute la chaîne = 100.'] },
                ],
              },
              {
                metric_name: 'Climate Risks',
                average_score: 100,
                level_3_metrics: [
                  { metric_name: 'Climate Adaptation Strategies And Risk Assessments', score: 100, sources: [], user_friendly_explanation: ['Apple has a detailed, TCFD-aligned climate risk assessment with both physical and transition risk analysis.'], information: [], score_explanation_english: ['TCFD-aligned climate risk disclosure = 100.'], score_explanation_french: ['Divulgation risques climatiques alignée TCFD = 100.'] },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      company_id: '2',
      company_name: 'COVER 50',
      company_ticker: 'COV.MI',
      country: 'Italy',
      head_quarter_iso_2_code: 'IT',
      industry: 'Consumer Discretionary',
      company_type: 'public',
      website: 'https://www.cover50.com',
      investor_website: 'https://www.cover50.com/investors',
      company_logo: null,
      Source: 'Humankind V2',
      status: 'success',
      is_current: true,
      timestamp: '2025-12-09T11:23:58.444',
      humankind_response: {
        global_score: 86.33,
        processing_time: 9500.0,
        category_details: [
          {
            category: 'Governance',
            average_score: 83.33,
            level_2_metrics: [
              { metric_name: 'Corruption Or Bribery Convictions', average_score: 100, level_3_metrics: [{ metric_name: 'Number Of Corruption Or Bribery Convictions', score: 100, sources: [], user_friendly_explanation: ['No corruption or bribery convictions reported.'], information: [], score_explanation_english: ['0 convictions = 100.'], score_explanation_french: ['0 condamnations = 100.'] }, { metric_name: 'Total Amount Of Fines Incurred', score: 100, sources: [], user_friendly_explanation: ['No regulatory fines reported.'], information: [], score_explanation_english: ['0% fines/revenue = 100.'], score_explanation_french: ['0% amendes/CA = 100.'] }] },
              { metric_name: 'Gender Diversity', average_score: 83, level_3_metrics: [{ metric_name: 'Gender Diversity At Board And Executive Level', score: 83, sources: [], user_friendly_explanation: ['Strong gender diversity with over 40% female board representation.'], information: [], score_explanation_english: ['40%+ women on board = 83.'], score_explanation_french: ['40%+ femmes au CA = 83.'] }] },
              { metric_name: 'Whistleblower', average_score: 100, level_3_metrics: [{ metric_name: 'Whistleblower Protections And Complaint Mechanisms', score: 100, sources: [], user_friendly_explanation: ['Strong whistleblower framework in place.'], information: [], score_explanation_english: ['Full protections = 100.'], score_explanation_french: ['Protections complètes = 100.'] }] },
              { metric_name: 'Data Security', average_score: 67, level_3_metrics: [{ metric_name: 'Data Security', score: 67, sources: [], user_friendly_explanation: ['Good data security practices with some gaps in quantitative reporting.'], information: [], score_explanation_english: ['Adequate practices, partial disclosure = 67.'], score_explanation_french: ['Bonnes pratiques, divulgation partielle = 67.'] }] },
              { metric_name: 'Data Privacy', average_score: 100, level_3_metrics: [{ metric_name: 'Data Privacy', score: 100, sources: [], user_friendly_explanation: ['COVER 50 has comprehensive GDPR-aligned data privacy practices with strong disclosure.'], information: [], score_explanation_english: ['GDPR-compliant, full disclosure = 100.'], score_explanation_french: ['Conforme RGPD, divulgation complète = 100.'] }] },
              { metric_name: 'Supplier Engagement And Monitoring', average_score: 100, level_3_metrics: [{ metric_name: 'Supplier Engagement And Monitoring', score: 100, sources: [], user_friendly_explanation: ['Robust supplier code of conduct with annual audits.'], information: [], score_explanation_english: ['Annual audits, comprehensive code = 100.'], score_explanation_french: ['Audits annuels, code complet = 100.'] }] },
              { metric_name: 'ESG Oversight And Management', average_score: 100, level_3_metrics: [{ metric_name: 'Board Oversight And Management Of ESG Topics', score: 100, sources: [], user_friendly_explanation: ['Board-level ESG committee with dedicated sustainability officer.'], information: [], score_explanation_english: ['Board ESG committee in place = 100.'], score_explanation_french: ['Comité ESG au CA en place = 100.'] }] },
              { metric_name: 'Ethical Marketing And Marketing Practices', average_score: 100, level_3_metrics: [{ metric_name: 'Ethical Marketing And Marketing Practices', score: 100, sources: [], user_friendly_explanation: ['Ethical advertising standards maintained, no greenwashing claims.'], information: [], score_explanation_english: ['Ethical marketing standards met = 100.'], score_explanation_french: ['Standards marketing éthique respectés = 100.'] }] },
              { metric_name: 'Financed Emissions', average_score: 0, level_3_metrics: [{ metric_name: 'Financed Emissions', score: 0, sources: [], user_friendly_explanation: ['No financed emissions disclosure available.'], information: [], score_explanation_english: ['No disclosure = 0.'], score_explanation_french: ['Pas de divulgation = 0.'] }] },
            ],
          },
          {
            category: 'People',
            average_score: 83.74,
            level_2_metrics: [
              { metric_name: 'Sustainable Economy', average_score: 100, level_3_metrics: [{ metric_name: 'Practices Policies And Future Initiatives For Transitioning Towards A More Sustainable Economy', score: 100, sources: [], user_friendly_explanation: ['Strong sustainable economy transition plan in place.'], information: [], score_explanation_english: ['Comprehensive plan = 100.'], score_explanation_french: ['Plan complet = 100.'] }] },
              { metric_name: 'Workforce Characteristics', average_score: 100, level_3_metrics: [{ metric_name: 'Gender Breakdown', score: 100, sources: [], user_friendly_explanation: ['Full gender breakdown disclosed.'], information: [], score_explanation_english: ['Full disclosure = 100.'], score_explanation_french: ['Divulgation complète = 100.'] }, { metric_name: 'Employee Turnover Rate', score: 100, sources: [], user_friendly_explanation: ['Employee turnover rate fully reported.'], information: [], score_explanation_english: ['Turnover rate disclosed = 100.'], score_explanation_french: ['Taux de turnover divulgué = 100.'] }] },
              { metric_name: 'Health And Safety', average_score: 91.67, level_3_metrics: [{ metric_name: 'Work Related Accident Rate', score: 75, sources: [], user_friendly_explanation: ['Low accident rate with clear improvement trajectory.'], information: [], score_explanation_english: ['Accident rate below benchmark = 75.'], score_explanation_french: ['Taux accident sous benchmark = 75.'] }, { metric_name: 'Number Of Work Related Fatalities', score: 100, sources: [], user_friendly_explanation: ['Zero work-related fatalities reported.'], information: [], score_explanation_english: ['0 fatalities = 100.'], score_explanation_french: ['0 décès = 100.'] }, { metric_name: 'Health And Safety Management System', score: 100, sources: [], user_friendly_explanation: ['ISO 45001 certified safety management system.'], information: [], score_explanation_english: ['ISO 45001 certified = 100.'], score_explanation_french: ['Certifié ISO 45001 = 100.'] }] },
              { metric_name: 'Workforce Remuneration', average_score: 85, level_3_metrics: [{ metric_name: 'Gender Pay Gap', score: 70, sources: [], user_friendly_explanation: ['Gender pay gap exists but narrowing with active closure program.'], information: [], score_explanation_english: ['Pay gap <10% with closure plan = 70.'], score_explanation_french: ['Écart <10% avec plan de fermeture = 70.'] }, { metric_name: 'Average Training Hours Per Employee', score: 100, sources: [], user_friendly_explanation: ['High training hours per employee exceeding sector average.'], information: [], score_explanation_english: ['Training hours exceed benchmark = 100.'], score_explanation_french: ['Heures de formation supérieures au benchmark = 100.'] }] },
              { metric_name: 'Workforce Characteristics Additional', average_score: 75, level_3_metrics: [{ metric_name: 'Female To Male Ratio At Management Level', score: 75, sources: [], user_friendly_explanation: ['35% female management representation.'], information: [], score_explanation_english: ['35% women in management = 75.'], score_explanation_french: ['35% femmes dans management = 75.'] }] },
              { metric_name: 'Human Rights', average_score: 100, level_3_metrics: [{ metric_name: 'Human Rights Policies And Processes', score: 100, sources: [], user_friendly_explanation: ['Comprehensive human rights due diligence process.'], information: [], score_explanation_english: ['Full HRDD process = 100.'], score_explanation_french: ['Processus HRDD complet = 100.'] }] },
              { metric_name: 'Human Rights Violations', average_score: 100, level_3_metrics: [{ metric_name: 'Confirmed Human Rights Violations', score: 100, sources: [], user_friendly_explanation: ['No confirmed human rights violations.'], information: [], score_explanation_english: ['0 violations = 100.'], score_explanation_french: ['0 violation = 100.'] }] },
              { metric_name: 'Product Safety', average_score: 2, level_3_metrics: [{ metric_name: 'Product Safety', score: 2, sources: [], user_friendly_explanation: ['Very limited product safety quantitative disclosure available.'], information: [], score_explanation_english: ['Minimal safety data disclosed = 2.'], score_explanation_french: ['Données sécurité minimales divulguées = 2.'] }] },
              { metric_name: 'Employee Engagement', average_score: 100, level_3_metrics: [{ metric_name: 'Employee Engagement', score: 100, sources: [], user_friendly_explanation: ['Annual engagement surveys with >80% participation rate.'], information: [], score_explanation_english: ['High engagement survey participation = 100.'], score_explanation_french: ['Taux participation enquête élevé = 100.'] }] },
            ],
          },
          {
            category: 'Planet',
            average_score: 91.93,
            level_2_metrics: [
              { metric_name: 'Energy And Greenhouse Gas Emission', average_score: 100, level_3_metrics: [{ metric_name: 'Total Energy Consumption', score: 100, sources: [], user_friendly_explanation: ['Full energy consumption data including renewable share.'], information: [], score_explanation_english: ['Complete energy disclosure = 100.'], score_explanation_french: ['Divulgation énergie complète = 100.'] }, { metric_name: 'Scope 1 Emissions', score: 100, sources: [], user_friendly_explanation: ['Complete Scope 1 GHG emissions reported.'], information: [], score_explanation_english: ['Full Scope 1 = 100.'], score_explanation_french: ['Scope 1 complet = 100.'] }, { metric_name: 'Scope 2 Emissions', score: 100, sources: [], user_friendly_explanation: ['Complete Scope 2 GHG emissions reported.'], information: [], score_explanation_english: ['Full Scope 2 = 100.'], score_explanation_french: ['Scope 2 complet = 100.'] }] },
              { metric_name: 'Pollution Of Air Water And Soil', average_score: 100, level_3_metrics: [{ metric_name: 'Pollution Emissions To Air Water And Soil', score: 100, sources: [], user_friendly_explanation: ['Comprehensive pollution control and disclosure.'], information: [], score_explanation_english: ['Full pollution disclosure = 100.'], score_explanation_french: ['Divulgation pollution complète = 100.'] }] },
              { metric_name: 'Biodiversity Impact', average_score: 100, level_3_metrics: [{ metric_name: 'Biodiversity Impact Number And Area Of Business Sites Near Sensitive Areas', score: 100, sources: [], user_friendly_explanation: ['Complete biodiversity impact mapping including sensitive areas.'], information: [], score_explanation_english: ['Full biodiversity assessment = 100.'], score_explanation_french: ['Évaluation biodiversité complète = 100.'] }] },
              { metric_name: 'Water Withdrawal', average_score: 93.5, level_3_metrics: [{ metric_name: 'Total Water Withdrawal', score: 100, sources: [], user_friendly_explanation: ['Full water withdrawal disclosure.'], information: [], score_explanation_english: ['Complete water data = 100.'], score_explanation_french: ['Données eau complètes = 100.'] }, { metric_name: 'Water Consumption', score: 87, sources: [], user_friendly_explanation: ['Good water consumption tracking with reduction targets.'], information: [], score_explanation_english: ['Good water management = 87.'], score_explanation_french: ['Bonne gestion eau = 87.'] }] },
              { metric_name: 'Waste Management', average_score: 100, level_3_metrics: [{ metric_name: 'Circular Economy Principles Usage', score: 100, sources: [], user_friendly_explanation: ['Strong circular economy integration.'], information: [], score_explanation_english: ['Full circular economy = 100.'], score_explanation_french: ['Économie circulaire complète = 100.'] }, { metric_name: 'Waste Generation', score: 100, sources: [], user_friendly_explanation: ['Complete waste generation and diversion data.'], information: [], score_explanation_english: ['Full waste data = 100.'], score_explanation_french: ['Données déchets complètes = 100.'] }] },
              { metric_name: 'GHG Reduction', average_score: 50, level_3_metrics: [{ metric_name: 'GHG Reduction Targets Scope 1 And 2 And 3', score: null, sources: [], user_friendly_explanation: ['No GHG reduction targets have been publicly disclosed yet.'], information: [], score_explanation_english: ['No targets disclosed = null.'], score_explanation_french: ['Pas d\'objectifs divulgués = null.'] }, { metric_name: 'Scope 3 Emissions Reporting', score: 100, sources: [], user_friendly_explanation: ['Full Scope 3 value chain emissions reported.'], information: [], score_explanation_english: ['Full Scope 3 = 100.'], score_explanation_french: ['Scope 3 complet = 100.'] }] },
              { metric_name: 'Climate Risks', average_score: 100, level_3_metrics: [{ metric_name: 'Climate Adaptation Strategies And Risk Assessments', score: 100, sources: [], user_friendly_explanation: ['Climate risk assessment with physical and transition risks covered.'], information: [], score_explanation_english: ['Complete climate risk assessment = 100.'], score_explanation_french: ['Évaluation risques climatiques complète = 100.'] }] },
            ],
          },
        ],
      },
    },
    {
      company_id: '3',
      company_name: 'Microsoft Corp.',
      company_ticker: 'MSFT',
      country: 'United States',
      head_quarter_iso_2_code: 'US',
      industry: 'Information Technology',
      company_type: 'public',
      website: 'https://www.microsoft.com',
      investor_website: 'https://investor.microsoft.com',
      company_logo: null,
      Source: 'Humankind V2',
      status: 'success',
      is_current: true,
      timestamp: '2025-12-15T10:00:00.000',
      humankind_response: {
        global_score: 78.9,
        processing_time: 10500.0,
        category_details: [
          { category: 'Governance', average_score: 81.0, level_2_metrics: [{ metric_name: 'Corruption Or Bribery Convictions', average_score: 100, level_3_metrics: [{ metric_name: 'Number Of Corruption Or Bribery Convictions', score: 100, sources: [], user_friendly_explanation: ['No convictions.'], information: [], score_explanation_english: ['0 = 100.'], score_explanation_french: ['0 = 100.'] }] }, { metric_name: 'Data Security', average_score: 72, level_3_metrics: [{ metric_name: 'Data Security', score: 72, sources: [], user_friendly_explanation: ['Strong enterprise security posture.'], information: [], score_explanation_english: ['Strong but incidents disclosed = 72.'], score_explanation_french: ['Fort mais incidents divulgués = 72.'] }] }, { metric_name: 'Data Privacy', average_score: 80, level_3_metrics: [{ metric_name: 'Data Privacy', score: 80, sources: [], user_friendly_explanation: ['Good privacy practices with GDPR compliance.'], information: [], score_explanation_english: ['GDPR + CCPA compliance = 80.'], score_explanation_french: ['Conformité RGPD + CCPA = 80.'] }] }, { metric_name: 'Gender Diversity', average_score: 77, level_3_metrics: [{ metric_name: 'Gender Diversity At Board And Executive Level', score: 77, sources: [], user_friendly_explanation: ['Improving board diversity.'], information: [], score_explanation_english: ['Board diversity improving = 77.'], score_explanation_french: ['Diversité CA en amélioration = 77.'] }] }, { metric_name: 'Financed Emissions', average_score: 0, level_3_metrics: [{ metric_name: 'Financed Emissions', score: 0, sources: [], user_friendly_explanation: ['Not disclosed.'], information: [], score_explanation_english: ['No disclosure = 0.'], score_explanation_french: ['Non divulgué = 0.'] }] }] },
          { category: 'People', average_score: 72.5, level_2_metrics: [{ metric_name: 'Health And Safety', average_score: 88, level_3_metrics: [{ metric_name: 'Health And Safety Management System', score: 88, sources: [], user_friendly_explanation: ['Comprehensive workplace safety.'], information: [], score_explanation_english: ['Strong H&S = 88.'], score_explanation_french: ['H&S fort = 88.'] }] }, { metric_name: 'Product Safety', average_score: 45, level_3_metrics: [{ metric_name: 'Product Safety', score: 45, sources: [], user_friendly_explanation: ['Software security disclosures partial.'], information: [], score_explanation_english: ['Partial disclosure = 45.'], score_explanation_french: ['Divulgation partielle = 45.'] }] }, { metric_name: 'Employee Engagement', average_score: 92, level_3_metrics: [{ metric_name: 'Employee Engagement', score: 92, sources: [], user_friendly_explanation: ['High employee engagement scores.'], information: [], score_explanation_english: ['Strong engagement = 92.'], score_explanation_french: ['Engagement fort = 92.'] }] }] },
          { category: 'Planet', average_score: 83.2, level_2_metrics: [{ metric_name: 'Energy And Greenhouse Gas Emission', average_score: 95, level_3_metrics: [{ metric_name: 'Total Energy Consumption', score: 95, sources: [], user_friendly_explanation: ['Near complete energy disclosure.'], information: [], score_explanation_english: ['Near full disclosure = 95.'], score_explanation_french: ['Divulgation quasi-complète = 95.'] }] }, { metric_name: 'GHG Reduction', average_score: 88, level_3_metrics: [{ metric_name: 'GHG Reduction Targets Scope 1 And 2 And 3', score: 88, sources: [], user_friendly_explanation: ['Carbon negative by 2030 target.'], information: [], score_explanation_english: ['Carbon negative target = 88.'], score_explanation_french: ['Objectif carbone négatif = 88.'] }] }, { metric_name: 'Climate Risks', average_score: 90, level_3_metrics: [{ metric_name: 'Climate Adaptation Strategies And Risk Assessments', score: 90, sources: [], user_friendly_explanation: ['Robust TCFD reporting.'], information: [], score_explanation_english: ['TCFD-aligned = 90.'], score_explanation_french: ['Aligné TCFD = 90.'] }] }] },
        ],
      },
    },
  ];

  getAll(): Company[] {
    return this.companies;
  }

  getById(id: string): Company | undefined {
    return this.companies.find(c => c.company_id === id);
  }

  search(query: string, industry: string, country: string, min: number, max: number): Company[] {
    return this.companies.filter(c => {
      const q = query.toLowerCase();
      const matchQ = !q || c.company_name.toLowerCase().includes(q) || c.company_ticker.toLowerCase().includes(q);
      const matchI = !industry || c.industry === industry;
      const matchC = !country  || c.country === country;
      const score  = c.humankind_response.global_score;
      const matchS = score >= min && score <= max;
      return matchQ && matchI && matchC && matchS;
    });
  }

  getIndustries(): string[] {
    return [...new Set(this.companies.map(c => c.industry))];
  }

  getCountries(): string[] {
    return [...new Set(this.companies.map(c => c.country))];
  }
}
