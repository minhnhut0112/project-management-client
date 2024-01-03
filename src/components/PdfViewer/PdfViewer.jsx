import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const PdfViewer = ({ pdfPath }) => {
  return (
    <div>
      <Document file={pdfPath}>
        <Page pageNumber={1} />
      </Document>
    </div>
  )
}

export default PdfViewer
