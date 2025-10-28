import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export async function GET() {
  try {
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServer();

    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("navn, kommune, telefon, email, birth_year")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    // Get CV entries (work experience)
    const { data: cvEntries, error: cvError } = await supabase
      .from("cv_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: false });

    if (cvError) {
      console.error("Error fetching CV entries:", cvError);
      return NextResponse.json(
        { error: "Failed to fetch CV entries" },
        { status: 500 }
      );
    }

    // Get skills
    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", user.id)
      .order("skill_name");

    if (skillsError) {
      console.error("Error fetching skills:", skillsError);
      return NextResponse.json(
        { error: "Failed to fetch skills" },
        { status: 500 }
      );
    }

    // Generate PDF
    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(userData.navn || "Ukjent Navn", 20, 30);

    // Contact information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let yPos = 45;

    if (userData.email) {
      doc.text(`Email: ${userData.email}`, 20, yPos);
      yPos += 8;
    }

    if (userData.telefon) {
      doc.text(`Telefon: ${userData.telefon}`, 20, yPos);
      yPos += 8;
    }

    if (userData.kommune) {
      doc.text(`Sted: ${userData.kommune}`, 20, yPos);
      yPos += 8;
    }

    if (userData.birth_year) {
      doc.text(`Fødselsår: ${userData.birth_year}`, 20, yPos);
      yPos += 8;
    }

    yPos += 10;

    // Work Experience section
    if (cvEntries && cvEntries.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Arbeidserfaring", 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      cvEntries.forEach((entry: any) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }

        doc.setFont("helvetica", "bold");
        doc.text(entry.title, 20, yPos);
        yPos += 6;

        doc.setFont("helvetica", "italic");
        doc.text(entry.company, 20, yPos);
        yPos += 6;

        // Format dates
        const startDate = new Date(entry.start_date).toLocaleDateString('no-NO');
        const endDate = entry.current_job
          ? "Nåværende"
          : entry.end_date
            ? new Date(entry.end_date).toLocaleDateString('no-NO')
            : "Ukjent";

        doc.setFont("helvetica", "normal");
        doc.text(`${startDate} - ${endDate}`, 20, yPos);
        yPos += 8;

        if (entry.description) {
          const splitDescription = doc.splitTextToSize(entry.description, 170);
          doc.text(splitDescription, 20, yPos);
          yPos += splitDescription.length * 5 + 5;
        }

        yPos += 5; // Space between entries
      });
    }

    // Skills section
    if (skills && skills.length > 0) {
      // Check if we need a new page
      if (yPos > 200) {
        doc.addPage();
        yPos = 30;
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Ferdigheter", 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Group skills by proficiency level
      const skillGroups: { [key: string]: string[] } = {
        "Ekspert": [],
        "Avansert": [],
        "Middels": [],
        "Nybegynner": []
      };

      skills.forEach((skill: any) => {
        const level = skill.proficiency_level || "Nybegynner";
        const levelMap: { [key: string]: string } = {
          "expert": "Ekspert",
          "advanced": "Avansert",
          "intermediate": "Middels",
          "beginner": "Nybegynner"
        };

        const norwegianLevel = levelMap[level] || level;
        if (!skillGroups[norwegianLevel]) {
          skillGroups[norwegianLevel] = [];
        }
        skillGroups[norwegianLevel].push(skill.skill_name);
      });

      Object.entries(skillGroups).forEach(([level, skillList]) => {
        if (skillList.length > 0) {
          // Check if we need a new page
          if (yPos > 250) {
            doc.addPage();
            yPos = 30;
          }

          doc.setFont("helvetica", "bold");
          doc.text(`${level}:`, 20, yPos);
          yPos += 6;

          doc.setFont("helvetica", "normal");
          const skillsText = skillList.join(", ");
          const splitSkills = doc.splitTextToSize(skillsText, 170);
          doc.text(splitSkills, 20, yPos);
          yPos += splitSkills.length * 5 + 8;
        }
      });
    }

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${userData.navn || 'CV'}_CV.pdf"`,
      },
    });

  } catch (error) {
    console.error("CV PDF generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}