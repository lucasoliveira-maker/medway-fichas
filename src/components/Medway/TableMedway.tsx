interface TableMedwayProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
}

export function TableMedway({ headers, rows, className = '' }: TableMedwayProps) {
  return (
    <div className={`overflow-x-auto rounded-md shadow-medway ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-medway-dark">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left font-montserrat font-semibold text-white border border-gray-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-medway-light'}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-body border border-gray-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
