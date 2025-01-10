function onBodyLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	console.log('deviceready');
}

async function downloadFile(url, filename){
	const data = await fetch(url)
	const blob = await data.blob()
	const objectUrl = URL.createObjectURL(blob)

	const link = document.createElement('a')

	link.setAttribute('href', objectUrl)
	link.setAttribute('download', filename)
	link.style.display = 'none'

	document.body.appendChild(link)

	link.click()

	document.body.removeChild(link)
}

function canvasShiftImage(canvas, shiftAmt, realPdfPageHeight){
	shiftAmt = parseInt(shiftAmt) || 0;
	if(shiftAmt <= 0){ return oldCanvas; }

	var newCanvas = document.createElement('canvas');
	newCanvas.height = Math.min(oldCanvas.height - shiftAmt, realPdfPageHeight);
	newCanvas.width = oldCanvas.width;
	var ctx = newCanvas.getContext('2d');

	var img = new Image();
	img.src = canvas.toDataURL();
	ctx.drawImage(img, 0, shiftAmt, img.width, img.height, 0, 0, img.width, img.height);

	return newCanvas;
}

function html2canvasSuccess(canvas){
	var pdf = new jsPDF("p", 'mm', 'a4');
	pdfInternals = pdf.internal,
		pdfPageSize = pdfInternals.pageSize,
		pdfScaleFactor = pdfInternals.scaleFactor,
		pdfPageWidth = pdfPageSize.width,
		pdfPageHeight = pdfPageSize.height,
		totalPdfHeight = 0,
		htmlPageHeight = canvas.height,
		htmlScaleFactor = canvas.width / (pdfPageWidth * pdfScaleFactor);
	console.log("1");
	while(totalPdfHeight < htmlPageHeight){
		console.log("xxxxx");
		var newCanvas = canvasShiftImage(canvas, totalPdfHeight, pdfPageHeight * pdfScaleFactor);
		pdf.addImage(newCanvas, 'png', 0, 0, pdfPageWidth, 0, null, 'NONE'); //note the format doesn't seem to do anything... I had it at 'pdf' and it didn't care

		totalPdfHeight += (pdfPageHeight * pdfScaleFactor * htmlScaleFactor);

		if(totalPdfHeight < htmlPageHeight){ pdf.addPage(); }
	}
	console.log("2");
	pdf.save('test.pdf');
};

function demoUpload(buttonCrop, form) {
	var $uploadCrop;

	function readFile(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$uploadCrop.croppie('bind', {
					url: e.target.result
				});
				$('.upload-demo').addClass('ready');
			}

			reader.readAsDataURL(input.files[0]);
		}
		else {
			swal("Sorry - you're browser doesn't support the FileReader API");
		}
	}

	$uploadCrop = $('#upload-demo').croppie({
		viewport: {
			width: 200,
			height: 200,
			type: 'square'
		},
		boundary: {
			width: 300,
			height: 300
		}
	});

	$('#input-upload').on('change', function () { readFile(this); });
	$(buttonCrop).on('click', function (ev) {
		$uploadCrop.croppie('result', {
			type: 'canvas',
			size: 'original'
		}).then(function (resp) {
			console.log("resp: " + resp);
			var blobData = dataURItoBlob(resp);
			console.log("dataURItoBlob: " + blobData);
			onCropAvatar(resp);
		});
	});
}

function dataURItoBlob(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}

function validateEmail(email) {
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (email.match(mailformat)) {
		return true;
	} else {
		return false;
	}
}

var html5QrCode = null;
function stopQrCodeReader(sucessCallback, failCallback) {
	if (html5QrCode == null) {
		return;
	}
	html5QrCode.stop().then(ignore => {
		// QR Code scanning is stopped.
		sucessCallback("Successfully Stopped!")
	}).catch(err => {
		// Stop failed, handle it.
		failCallback("Failed to stop!")
	});
}

function initQRCodeReader(sucessCallback, failCallback) {
	Html5Qrcode.getCameras().then(devices => {
		if (devices && devices.length) {
			//var cameraId = devices[0].id;
			//alert(cameraId + "");
			sucessCallback(devices);
		}
	}).catch(err => {
		failCallback("Không tìm thấy thiết bị camera nào");
	});
}

function scanQRCode(elementId, cameraId, sucessCallback, failCallback) {
	if (html5QrCode == null) {
		html5QrCode = new Html5Qrcode(elementId);
	}
	html5QrCode.start(
		cameraId, // retreived in the previous step.
		{
			fps: 10,    // sets the framerate to 10 frame per second
			qrbox: 250  // sets only 250 X 250 region of viewfinder to
						// scannable, rest shaded.
		},
		qrCodeMessage => {
			// do something when code is read. For example:
// 					alert("QR Code detected:" + qrCodeMessage);
			sucessCallback(qrCodeMessage)
		},
		errorMessage => {
			// parse error, ideally ignore it. For example:
			//alert('QR Code no longer in front of camera.');
			failCallback("QR Code no longer in front of camera");
		})
		.catch(err => {
			// Start failed, handle it. For example,
			alert("Unable to start scanning, error:" + err);
			failCallback(err);
		});
}

