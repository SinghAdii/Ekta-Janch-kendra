export type TestDetailData = {
  name: string;
  description?: string;

  details: {
    testName?: string;
    sampleType?: string;
    gender?: string;
    ageGroup?: string;
    reportTimeline?: string;
    includes?: string;
    discount?: string;
    originalPrice?: number;
    finalPrice?: number;
    currency?: string;
  };

  pdfUrl?: string;
};

type Props = {
  data: TestDetailData;
  onRemove?: () => void;
};

export default function TestDetailCard({ data, onRemove }: Props) {
  const { name, description, details, pdfUrl } = data;
  const currency = details.currency ?? "₹";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-lg font-semibold mb-3">
        {name || "Detail about Test"}
      </h2>
      <div className="h-1 bg-primary mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow border p-6">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-primary font-semibold text-base">
              Test name and other details
            </h3>

            {onRemove && (
              <button
                onClick={onRemove}
                className="text-xs px-3 py-1 bg-primary text-white rounded"
              >
                Remove
              </button>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {details.testName && (
              <Row label="Test Name" value={details.testName} />
            )}
            {details.sampleType && (
              <Row label="Sample Type" value={details.sampleType} />
            )}
            {details.gender && <Row label="Gender" value={details.gender} />}
            {details.ageGroup && (
              <Row label="Age Group" value={details.ageGroup} />
            )}
            {details.reportTimeline && (
              <Row label="Report Timeline" value={details.reportTimeline} />
            )}
            {details.includes && (
              <Row label="This Package Includes" value={details.includes} />
            )}
            {details.discount && (
              <Row label="Discount" value={details.discount} />
            )}

            {(details.originalPrice || details.finalPrice) && (
              <div className="flex gap-4 pt-2 items-center">
                <span className="font-medium text-primary w-44">Price</span>
                <div className="flex gap-3 items-center">
                  {details.originalPrice && (
                    <span className="line-through text-gray-400">
                      {currency} {details.originalPrice}
                    </span>
                  )}
                  {details.finalPrice && (
                    <span className="font-semibold text-primary">
                      {currency} {details.finalPrice}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {description && (
            <div className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-primary font-semibold mb-3">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {pdfUrl && (
            <div className="bg-white rounded-xl shadow border p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                Download Digital PDF
              </span>
              <a
                href={pdfUrl}
                target="_blank"
                className="text-xs px-3 py-1 bg-primary text-white rounded"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="font-medium text-primary w-44">{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
