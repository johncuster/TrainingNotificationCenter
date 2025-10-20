import MemberContainer from "./memberContainer.jsx";    
import '../adminView/adminGlobal.css';

const TableWithPagination = () => {
const [data, setData] = useState([]); // Store table data
const [page, setPage] = useState(1); // Track current page
const [loading, setLoading] = useState(false); // Loading state

const rowsPerPage = 30;

// Fetch data (simulate API call)
const fetchData = async (page) => {
setLoading(true);
const newData = Array.from({ length: rowsPerPage }, (_, i) => ({
id: (page - 1) * rowsPerPage + i + 1,
name: `Item ${(page - 1) * rowsPerPage + i + 1}`,
}));
setTimeout(() => {
setData((prev) => [...prev, ...newData]);
setLoading(false);
}, 1000);
};

// Load more data on scroll
const handleScroll = () => {
if (
window.innerHeight + document.documentElement.scrollTop >=
document.documentElement.offsetHeight &&
!loading
) {
setPage((prev) => prev + 1);
}
};

useEffect(() => {
fetchData(page);
}, [page]);

useEffect(() => {
window.addEventListener("scroll", handleScroll);
return () => window.removeEventListener("scroll", handleScroll);
}, [loading]);

return (
<div>
<table border="1" style={{ width: "100%", textAlign: "left" }}>
<thead>
<tr>
<th>ID</th>
<th>Name</th>
</tr>
</thead>
<tbody>
{data.map((row) => (
<tr key={row.id}>
<td>{row.id}</td>
<td>{row.name}</td>
</tr>
))}
</tbody>
</table>
{loading && <p>Loading...</p>}
</div>
);
};

const AdminMember = () => {
    return (
        <main>
            <div className="titleHeader">
                <h2>Manage Members</h2>  
            </div>

            <MemberContainer />
        </main>
    )
};

export default AdminMember;