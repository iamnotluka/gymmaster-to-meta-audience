import React, { useState } from "react";

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [convertedData, setConvertedData] = useState<string[][]>([]);
	const [convertedCsv, setConvertedCsv] = useState<string>("");

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = e.target.files?.[0];
		if (uploadedFile) setFile(uploadedFile);
	};

	const parseCsv = async (file: File): Promise<string[][]> => {
		const text = await file.text();
		return text
			.trim()
			.split("\n")
			.map((line) => line.split(",").map((v) => v.trim()));
	};

	const handleConvert = async () => {
		if (!file) return;
		const rows = await parseCsv(file);
		const header = rows[0];
		const emailIdx = header.findIndex((h) => h.toLowerCase().includes("email"));
		const phoneIdx = header.findIndex((h) => h.toLowerCase().includes("cell"));

		const converted: string[][] = [["email", "phone"]];
		for (let i = 1; i < rows.length; i++) {
			const email = rows[i][emailIdx] || "";
			const phone = rows[i][phoneIdx] || "";
			if (email || phone) converted.push([email, phone]);
		}

		setConvertedData(converted);

		const csvContent = converted.map((r) => r.join(",")).join("\n");
		setConvertedCsv(csvContent);
	};

	const handleDownload = () => {
		const blob = new Blob([convertedCsv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "meta_audience.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div style={{ padding: 40, fontFamily: "sans-serif" }}>
			<h1>GymMaster → Meta Audience</h1>

			<section style={{ marginTop: 20 }}>
				<h3>Step 1: Upload File</h3>
				<input type="file" accept=".csv" onChange={handleFileUpload} />
			</section>

			<section style={{ marginTop: 20 }}>
				<h3>Step 2: Convert</h3>
				<button onClick={handleConvert} disabled={!file}>
					Convert to Meta Audience
				</button>
			</section>

			<section style={{ marginTop: 20 }}>
				<h3>Step 3: Preview</h3>
				{convertedData.length > 0 ? (
					<table border={1} cellPadding={6}>
						<thead>
							<tr>
								{convertedData[0].map((h, i) => (
									<th key={i}>{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{convertedData.slice(1, 5).map((row, i) => (
								<tr key={i}>
									{row.map((c, j) => (
										<td key={j}>{c}</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>No data yet</p>
				)}
			</section>

			<section style={{ marginTop: 20 }}>
				<h3>Step 4: Download</h3>
				<button onClick={handleDownload} disabled={!convertedCsv}>
					Download CSV
				</button>
			</section>
		</div>
	);
}

export default App;
