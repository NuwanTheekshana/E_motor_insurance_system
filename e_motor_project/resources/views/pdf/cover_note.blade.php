<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Temporary Vehicle Insurance Cover Note</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            position: relative;
            margin: 20px;
            padding: 20px;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            max-width: 800px;
            margin: auto;
            overflow: hidden; 
            background-color: #f4f4f9;
            background-image: linear-gradient(to bottom right, #e3f2fd 20%, #fff9c4 80%);
            background-size: cover;
        }

        .shape {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            z-index: -2;
        }

        .shape.blue {
            background-color: #81d4fa;
            top: -100px;
            left: -100px;
            opacity: 0.2;
        }

        .shape.yellow {
            background-color: #fff9c4;
            bottom: -100px;
            right: -100px;
            opacity: 0.2;
        }

        .watermark {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('path/to/your/watermark/image.jpg');   
            z-index: -1;
            opacity: 0.1;
            object-fit: cover; 
            pointer-events: none;
        }

        .certificate-header,
        .company-details,
        .certificate-details,
        .expiry-notice,
        .certificate-footer {
            position: relative;
            z-index: 1;
        }

        .certificate-header {
            text-align: center;
            margin-bottom: 10px;
            background: linear-gradient(to right, #64b5f6, #4fc3f7);
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .certificate-header h1 {
            font-size: 28px;
            margin: 0;
        }

        .company-details {
            text-align: center;
            margin-bottom: 20px;
            font-size: 16px;
            color: #333;
            background: #e8f5e9;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .company-details p {
            margin: 2px 0;
        }

        .certificate-details {
            margin-bottom: 20px;
        }

        .certificate-details h2 {
            font-size: 22px;
            text-decoration: underline;
            color: #1565c0; /* Deep blue for headers */
            margin-bottom: 10px;
        }

        .certificate-details .info {
            margin-bottom: 10px;
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
        }

        .certificate-details .info div {
            margin-bottom: 5px;
            color: #555;
        }

        .hidden-table {
            width: 100%;
            border-collapse: collapse;
        }

        .hidden-table td {
            padding: 10px;
            border: 1px solid #ddd;
            color: #333;
        }

        .hidden-table .column1,
        .hidden-table .column2 {
            width: 100%;
        }

        .expiry-notice {
            text-align: center;
            font-weight: bold;
            color: #D32F2F;
            background-color: #FFEBEE;
            border: 1px solid #D32F2F;
            border-radius: 5px;
            margin-top: 20px;
            padding: 10px;
        }

        .certificate-footer {
            text-align: center;
            margin-top: 30px;
            color: #555;
            background: #f1f8e9;
            padding: 10px;
            border-radius: 5px;
        }

        .qr-code {
            margin-top: 20px;
        }

        .qr-code img {
            width: 150px;
            height: 150px;
            border: 2px solid #4CAF50;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="shape blue"></div>
    <div class="shape yellow"></div>
    
    <div class="certificate-header">
        <h1>Temporary Vehicle Insurance Cover Note</h1>
    </div>

    <div class="company-details">
        <p><strong>E-Motor Vehicle Insurance PLC</strong></p>
        <p>No. 123, Main Street, Colombo 01, Sri Lanka</p>
        <p>Phone: +94 11 2345678</p>
        <p>Email: info@emotor.com</p>
        <p>Website: www.emotor.com</p>
    </div>

    <div class="certificate-details">
        <h2>Policy Holder Information</h2>
        <div class="info">
            <div><strong>Policy Holder Name:</strong> {{ $policy_holder_name }} 
            </div>
        </div>
        
    </div>

    <div class="certificate-details">
        <h2>Vehicle Information</h2>
        <div class="hidden-table">
            <table>
                <tr>
                    <td class="column1"><strong>Vehicle No:</strong> {{ $vehicle_no }}</td>
                    <td class="column2"><strong>Engine No:</strong> {{ $engine_no }}</td>
                </tr>
                <tr>
                    <td class="column1"><strong>Chassis No:</strong> {{ $chassis_no }}</td>
                    <td class="column2"><strong>Policy No:</strong> {{ $policy_no }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="certificate-details">
        <h2>Policy Information</h2>
        <div class="info">
            <div><strong>Policy Period:</strong> {{ $policy_period }}</div>
        </div>
    </div>

    <div class="expiry-notice">
        This cover note is valid for 60 days from the date of issue and will expire on <strong>{{ $expiration_date }}</strong>.
    </div>

    <div class="certificate-footer">
        <p>This is a temporary cover note for the vehicle mentioned above.</p>
        <p><strong>Date of Issue:</strong> {{ $issue_date }}</p>

        <div class="qr-code">
            <img src="data:image/png;base64,{{ $qr_code }}" alt="QR Code">
        </div>
    </div>
</body>
</html>
