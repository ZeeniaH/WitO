import { savePDF } from "@progress/kendo-react-pdf";

class DocService {
	createPdf = (html, fileName) => {
		savePDF(html, {
			paperSize: "A4",
			fileName: `INV-${fileName}.pdf`, // Use the provided fileName
			margin: 3,
			scale: 0.7,
		});
	};
}

const Doc = new DocService();
export default Doc;
