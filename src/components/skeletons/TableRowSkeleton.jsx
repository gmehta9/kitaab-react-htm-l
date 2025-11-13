import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function TableRowSkeleton({ rows = 5, columns = 5 }) {
    return (
        <>
            {Array(rows).fill(0).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array(columns).fill(0).map((_, colIndex) => (
                        <td key={colIndex}>
                            <Skeleton height={20} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default TableRowSkeleton;
