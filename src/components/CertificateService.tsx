import React, { useState } from "react";
import { Award, Download, ShieldCheck, RefreshCw, Star } from "lucide-react";
import { jsPDF } from "jspdf";

interface CertificateServiceProps {
  studentName: string;
  courseTitle: string;
  courseId: string;
  studentId: string;
}

export default function CertificateService({ studentName, courseTitle, courseId, studentId }: CertificateServiceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    setErrorMsg("");

    try {
      // Create landscape A4 PDF document
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const width = doc.internal.pageSize.getWidth(); // ~297mm
      const height = doc.internal.pageSize.getHeight(); // ~210mm

      // 1. Draw elegant rich background gradient simulated by concentric rectangle panels
      doc.setFillColor(250, 251, 252); // soft cream off-white
      doc.rect(0, 0, width, height, "F");

      // 2. Draw dual-layered professional border matrix
      // Outer border: Royal Midnight Navy
      doc.setDrawColor(11, 27, 61); // #0B1B3D
      doc.setLineWidth(2.5);
      doc.rect(8, 8, width - 16, height - 16);

      // Inner border: Elite Lustrous Gold
      doc.setDrawColor(197, 160, 89); // #C5A059
      doc.setLineWidth(0.8);
      doc.rect(11, 11, width - 22, height - 22);

      // Decorative corner accents (Gold L-shapes)
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(1.5);
      // Top-Left Corner
      doc.line(14, 14, 26, 14);
      doc.line(14, 14, 14, 26);
      // Top-Right Corner
      doc.line(width - 14, 14, width - 26, 14);
      doc.line(width - 14, 14, width - 14, 26);
      // Bottom-Left Corner
      doc.line(14, height - 14, 26, height - 14);
      doc.line(14, height - 14, 14, height - 26);
      // Bottom-Right Corner
      doc.line(width - 14, height - 14, width - 26, height - 14);
      doc.line(width - 14, height - 14, width - 14, height - 26);

      // 3. Institution Crest Header
      doc.setTextColor(11, 27, 61); // Royal Midnight Navy
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("DSP ACADEMY", width / 2, 32, { align: "center" });

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 110, 125);
      doc.text("EXCELLENCE • EMPOWERMENT • INNOVATION", width / 2, 37, { align: "center" });

      // Small central horizontal separator line
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.5);
      doc.line(width / 2 - 20, 42, width / 2 + 20, 42);

      // 4. Main Certificate Title Type
      doc.setTextColor(197, 160, 89); // Gold
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(28);
      doc.text("CERTIFICATE OF COMPLETION", width / 2, 58, { align: "center" });

      // 5. Presentational Subtitle
      doc.setTextColor(80, 90, 105);
      doc.setFont("Times", "italic");
      doc.setFontSize(14);
      doc.text("This prestigious credential is proudly presented to", width / 2, 70, { align: "center" });

      // 6. Recipient's FULL NAME (Massive Cursive-like Bold display font)
      doc.setTextColor(11, 27, 61); // Deep Navy
      doc.setFont("Times", "bolditalic");
      doc.setFontSize(36);
      // Upper-case name for standard professionalism
      const normalizedName = studentName.toUpperCase();
      doc.text(normalizedName, width / 2, 88, { align: "center" });

      // Elegant underlining for the name
      doc.setDrawColor(11, 27, 61);
      doc.setLineWidth(1);
      doc.line(width / 2 - 65, 92, width / 2 + 65, 92);

      // 7. Achievement Statement
      doc.setTextColor(80, 90, 105);
      doc.setFont("Times", "italic");
      doc.setFontSize(13);
      doc.text("for outstanding performance and successful completion of the masterclass curriculum", width / 2, 104, { align: "center" });

      // 8. Course Title (Prominent, High-contrast Bold)
      doc.setTextColor(0, 86, 210); // Rich Blue #0056D2
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      const uppercaseCourseTitle = courseTitle.toUpperCase();
      doc.text(uppercaseCourseTitle, width / 2, 116, { align: "center" });

      // 9. Date & Verification Badge Left/Right Column
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Verification Details in the center bottom
      const hashId = `DSP-${studentId.substring(0, 6).toUpperCase()}-${courseId.substring(0, 4).toUpperCase()}`;
      doc.setFont("Courier", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 130, 145);
      doc.text(`CREDENTIAL ID: ${hashId}`, width / 2, 142, { align: "center" });
      doc.text(`ISSUED DATE: ${currentDate}`, width / 2, 147, { align: "center" });
      doc.text("VERIFIED SECURE VIA ACCREDITED BLOCKS", width / 2, 152, { align: "center" });

      // 10. Draw double signature lines & descriptions (Left & Right alignment)
      // Left Signature: Coach Charles
      doc.setDrawColor(180, 190, 200);
      doc.setLineWidth(0.4);
      doc.line(45, 172, 105, 172);
      
      doc.setTextColor(11, 27, 61);
      doc.setFont("Times", "bolditalic");
      doc.setFontSize(12);
      doc.text("Coach Charles", 75, 178, { align: "center" });
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 130, 145);
      doc.text("Executive Program Director", 75, 183, { align: "center" });

      // Right Signature: Chief Registrar
      doc.setDrawColor(180, 190, 200);
      doc.setLineWidth(0.4);
      doc.line(width - 105, 172, width - 45, 172);

      doc.setTextColor(11, 27, 61);
      doc.setFont("Times", "bolditalic");
      doc.setFontSize(12);
      doc.text("Sandra Cole", width - 75, 178, { align: "center" });
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 130, 145);
      doc.text("Chief Admissions Registrar", width - 75, 183, { align: "center" });

      // 11. Center golden award star logo vector representation
      doc.setDrawColor(197, 160, 89);
      doc.setFillColor(197, 160, 89);
      // Central gold circle
      doc.circle(width / 2, 172, 8, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("DSP", width / 2, 174.5, { align: "center" });

      // Trigger standard PDF download window
      const cleanFileName = `DSP-Academy-Certificate-${studentName.replace(/\s+/g, "-")}.pdf`;
      doc.save(cleanFileName);

    } catch (err: any) {
      console.error("PDF generation exception:", err);
      setErrorMsg("Failed to compile layout elements into PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="student-certificate-claim-banner" className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-amber-500/40 p-6 sm:p-8 rounded-3xl shadow-xl text-left relative overflow-hidden space-y-6">
      {/* Decorative vector stars background */}
      <div className="absolute right-4 top-4 text-amber-500/10 pointer-events-none">
        <Star className="w-24 h-24 stroke-[0.5]" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-mono uppercase tracking-widest font-black">
            <Award className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>Curriculum Graduated</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
            Claim Your Official Academic Certificate
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Congratulations, <strong className="text-amber-400">{studentName}</strong>! You have successfully completed 100% of the lessons in <strong className="text-white">"{courseTitle}"</strong>. Your official graduation credential is compiled and ready for immediate download.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-850 text-slate-950 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-950/40"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>Compiling Certificate...</span>
              </>
            ) : (
              <>
                <Download className="w-4.5 h-4.5" />
                <span>Download PDF Certificate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-900/30 text-rose-300 text-xs rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Authentic institutional certification signed by executive course directors.</span>
      </div>
    </div>
  );
}
