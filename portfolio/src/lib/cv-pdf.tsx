import { pdf, Document, Page, Text, View, Link, StyleSheet, Image } from "@react-pdf/renderer";

// Data types shared with the API route
export interface CvSettings {
  name: string;
  title: string;
  about?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

export interface CvExperience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
}

export interface CvPublication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
}

export interface CvProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export type CvSkillsByCategory = Record<string, { name: string; level: number }[]>;

export interface CvPdfData {
  settings: CvSettings;
  education: CvExperience[];
  work: CvExperience[];
  skillsByCategory: CvSkillsByCategory;
  publications: CvPublication[];
  projects: CvProject[];
}

const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoilo-two-ivory.vercel.app";
const ICON_BASE_URL = `${SITE_BASE_URL}/pdf-icons`;

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 6,
  },
  headerLinksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  headerLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    marginBottom: 2,
  },
  headerIconImage: {
    width: 12,
    height: 12,
    marginRight: 3,
  },
  headerLink: {
    fontSize: 9,
    color: "#1d4ed8",
    textDecoration: "none",
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 3,
    marginBottom: 6,
  },
  experienceRow: {
    marginBottom: 6,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  experienceTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  experienceCompany: {
    fontSize: 9,
  },
  experienceDates: {
    fontSize: 9,
    color: "#6b7280",
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillCategory: {
    width: "50%",
    paddingRight: 8,
    marginBottom: 4,
  },
  skillCategoryTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  skillChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    fontSize: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 3,
    marginBottom: 3,
    borderWidth: 0.5,
    borderColor: "#d1d5db",
  },
  projectRow: {
    marginBottom: 5,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  projectTags: {
    fontSize: 8,
    color: "#6b7280",
  },
  publicationRow: {
    marginBottom: 4,
    fontSize: 9,
  },
  publicationTitle: {
    fontWeight: "bold",
  },
});

function formatDate(dateStr?: string | null, current?: boolean): string {
  if (!dateStr && current) return "Present";
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function CvPdfDocument({
  settings,
  education,
  work,
  skillsByCategory,
  publications,
  projects,
}: CvPdfData) {
  const emailLink = settings.email ? `mailto:${settings.email}` : undefined;
  const mailIcon = `${ICON_BASE_URL}/mail.png`;
  const githubIcon = `${ICON_BASE_URL}/github.png`;
  const linkedinIcon = `${ICON_BASE_URL}/linkedin.png`;
  const websiteIcon = `${ICON_BASE_URL}/website.png`;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View>
          <Text style={styles.headerName}>{settings.name}</Text>
          <Text style={styles.headerTitle}>{settings.title}</Text>
          <View style={styles.headerLinksRow}>
            {emailLink && (
              <View style={styles.headerLinkItem}>
                <Image src={mailIcon} style={styles.headerIconImage} />
                <Link src={emailLink} style={styles.headerLink}>{settings.email}</Link>
              </View>
            )}
            {settings.github && (
              <View style={styles.headerLinkItem}>
                <Image src={githubIcon} style={styles.headerIconImage} />
                <Link src={settings.github} style={styles.headerLink}>{settings.github.replace("https://github.com/", "")}</Link>
              </View>
            )}
            {settings.linkedin && (
              <View style={styles.headerLinkItem}>
                <Image src={linkedinIcon} style={styles.headerIconImage} />
                <Link src={settings.linkedin} style={styles.headerLink}>{settings.linkedin.replace("https://www.linkedin.com/in/", "").replace("https://linkedin.com/in/", "")}</Link>
              </View>
            )}
            {settings.website && (
              <View style={styles.headerLinkItem}>
                <Image src={websiteIcon} style={styles.headerIconImage} />
                <Link src={settings.website} style={styles.headerLink}>{settings.website.replace(/^https?:\/\//, "")}</Link>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        {settings.about && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.paragraph}>{settings.about}</Text>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((e) => (
              <View key={e.id} style={styles.experienceRow} wrap={false}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.experienceTitle}>{e.title}</Text>
                    <Text style={styles.experienceCompany}>
                      {e.company}
                      {e.location ? ` — ${e.location}` : ""}
                    </Text>
                  </View>
                  <Text style={styles.experienceDates}>
                    {formatDate(e.startDate, false)} — {e.current ? "Present" : formatDate(e.endDate ?? undefined, false)}
                  </Text>
                </View>
                {e.description && (
                  <Text style={styles.paragraph}>{e.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Work Experience */}
        {work.length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {work.map((w) => (
              <View key={w.id} style={styles.experienceRow} wrap={false}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.experienceTitle}>{w.title}</Text>
                    <Text style={styles.experienceCompany}>
                      {w.company}
                      {w.location ? ` — ${w.location}` : ""}
                    </Text>
                  </View>
                  <Text style={styles.experienceDates}>
                    {formatDate(w.startDate, false)} — {w.current ? "Present" : formatDate(w.endDate ?? undefined, false)}
                  </Text>
                </View>
                {w.description && (
                  <Text style={styles.paragraph}>{w.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsRow}>
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <View key={category} style={styles.skillCategory} wrap={false}>
                  <Text style={styles.skillCategoryTitle}>{category}</Text>
                  <View style={styles.skillChipRow}>
                    {items.map((skill) => (
                      <Text key={skill.name} style={styles.skillChip}>{skill.name}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.projectRow} wrap={false}>
                <Text style={styles.projectTitle}>{p.title}</Text>
                <Text style={styles.paragraph}>{p.description}</Text>
                {p.tags.length > 0 && (
                  <Text style={styles.projectTags}>{p.tags.slice(0, 4).join(" · ")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Publications</Text>
            {publications.map((p) => (
              <View key={p.id} style={styles.publicationRow} wrap={false}>
                <Text>
                  <Text style={styles.publicationTitle}>{p.title}</Text>
                  <Text> — {p.authors}. </Text>
                  <Text>{p.venue}, {p.year}.</Text>
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function createCvPdfBuffer(data: CvPdfData): Promise<ReadableStream<Uint8Array>> {
  const instance = pdf(<CvPdfDocument {...data} />);
  const stream = (await instance.toBuffer()) as unknown as ReadableStream<Uint8Array>;
  return stream;
}
