import { jsPDF } from "jspdf";


export function generatePDF(data: any, aiText: string) {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Saudi Arabia Expansion Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`Client: ${data.fullName}`, 20, 40);
  doc.text(`Investor Type: ${data.investorType}`, 20, 50);
  doc.text(`Activity: ${data.activity}`, 20, 60);
  doc.text(`City: ${data.city}`, 20, 70);

  doc.text("AI Advisory Report", 20, 90);

  const lines = doc.splitTextToSize(aiText, 170);

  doc.text(lines, 20, 100);

  return doc.output("arraybuffer");
}