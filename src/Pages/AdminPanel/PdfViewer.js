import React from 'react';
import { Document, Page } from 'react-pdf';

const PdfViewer = ({ file }) => {
    // Assuming `file` is a byte array
    const typedArray = new Uint8Array(file);
 if (file==null) console.log("1")
    return (
        <div className="pdf-viewer">

            <Document file={typedArray}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
};
export default PdfViewer;
