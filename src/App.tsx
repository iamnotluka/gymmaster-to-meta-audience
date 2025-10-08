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
		<div className="min-h-screen bg-white">
			<div className="max-w-3xl mx-auto px-8 py-20">
				<div className="border-b border-gray-200 pb-8 mb-12">
					<h1 className="text-5xl font-light text-gray-900 tracking-tight mb-3">GymMaster → Meta Audience</h1>
					<p className="text-sm text-gray-500">
						<a
							href="https://www.loom.com/share/4e729736df244536908fecb8e52e3dcd?sid=51bf7450-54d3-4e57-ab6b-bc151c333946"
							target="_blank"
							className="text-gray-700 hover:text-gray-900 border-b border-gray-400 hover:border-gray-900 transition-colors"
						>
							View tutorial
						</a>
					</p>
				</div>

				<div className="space-y-12">
					<section>
						<div className="flex items-baseline gap-4 mb-4">
							<span className="text-sm font-mono text-gray-400">01</span>
							<h3 className="text-2xl font-light text-gray-900">Upload File</h3>
						</div>
						<div className="ml-12">
							<input
								type="file"
								accept=".csv"
								onChange={handleFileUpload}
								className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-5 file:rounded-none file:border file:border-gray-900 file:bg-transparent file:text-gray-900 file:font-light hover:file:bg-gray-50 file:cursor-pointer cursor-pointer transition-colors"
							/>
							{file && <p className="mt-3 text-xs text-gray-600 font-mono">{file.name}</p>}
						</div>
					</section>

					<section>
						<div className="flex items-baseline gap-4 mb-4">
							<span className="text-sm font-mono text-gray-400">02</span>
							<h3 className="text-2xl font-light text-gray-900">Convert</h3>
						</div>
						<div className="ml-12">
							<button
								onClick={handleConvert}
								disabled={!file}
								className="px-8 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
							>
								Convert to Meta Audience
							</button>
						</div>
					</section>

					<section>
						<div className="flex items-baseline gap-4 mb-4">
							<span className="text-sm font-mono text-gray-400">03</span>
							<h3 className="text-2xl font-light text-gray-900">Preview</h3>
						</div>
						<div className="ml-12">
							{convertedData.length > 0 ? (
								<div className="overflow-x-auto border border-gray-200">
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr className="bg-gray-50">
												{convertedData[0].map((h, i) => (
													<th
														key={i}
														className="px-6 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider"
													>
														{h}
													</th>
												))}
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-100">
											{convertedData.slice(1, 5).map((row, i) => (
												<tr key={i} className="hover:bg-gray-50 transition-colors">
													{row.map((c, j) => (
														<td key={j} className="px-6 py-4 text-sm text-gray-700 font-light">
															{c}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-gray-400 text-sm font-light italic">No data yet</p>
							)}
						</div>
					</section>

					<section>
						<div className="flex items-baseline gap-4 mb-4">
							<span className="text-sm font-mono text-gray-400">04</span>
							<h3 className="text-2xl font-light text-gray-900">Download</h3>
						</div>
						<div className="ml-12">
							<button
								onClick={handleDownload}
								disabled={!convertedCsv}
								className="px-8 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
							>
								Download CSV
							</button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default App;
