var printQRCodesConfig = {
    itemOnRow: 12,
    fontSize: 10,
    textHeight: 12
};

function printQRCodes(codes, config) {
    if(!codes || codes.length == 0) {
        console.log('codes empty');
        return;
    }
    if(config && config.itemOnRow) {
        printQRCodesConfig.itemOnRow = config.itemOnRow
    }
    if(config && config.fontSize) {
        printQRCodesConfig.fontSize = config.fontSize
    }
    if(config && config.textHeight) {
        printQRCodesConfig.textHeight = config.textHeight
    }
    let wd = window.open();
    let version = new Date().getTime();
    let html = `
    <html>
        <head>
        	<style>
    		body{width:100%;height:100%;margin:0;padding:0;background-color:#fafafa;font:12pt Tahoma}*{box-sizing:border-box;-moz-box-sizing:border-box}.page{width:793px;min-height:1122px;padding:4px;margin:0 auto;border:1px #d3d3d3 solid;border-radius:5px;background:#fff;box-shadow:0 0 5px #000;display:flex;align-items:center;justify-content:space-around;flex-wrap:wrap}.print-qr-item{display:inline-flex;text-align:center;border:1px solid #000;padding:10px;flex-direction:column;margin-bottom:4px}.print-qr-title{text-align:center;padding-top:8px;font-weight:600;font-size:14px}@page{size:A4;margin:0}@media print{html,body{width:793px;height:1122px}.page{margin:0;border:initial;border-radius:initial;width:initial;min-height:initial;box-shadow:initial;background:initial;page-break-after:always}}
            </style>
            <script src="/js/printQRCodes/easy.qrcode.min.js?v=${version}"><\/script>
            <script src="/js/printQRCodes/jspdf.min.js?v=${version}"><\/script>
            <script src="/js/printQRCodes/html2canvas.min.js?v=${version}"><\/script>
            <script>
            	var printQRCodesConfig = ${JSON.stringify(printQRCodesConfig)};
                var codes = ${JSON.stringify(codes)};
            <\/script>
            <script src="/js/printQRCodes/printQRCode.js?v=${version}"><\/script>
        <\/head>
        <body>
        <\/body>
    <\/html>
    `;
    wd.document.write(html);
    wd.document.close();
}