import UserList from "../components/admin/UserList";
import Statistics from "../components/admin/Statistics";

const AdminPage = () => {
    return (
        <div className="container">
            <h1>Panel de Administración</h1>
            <div className="row">
                <div className="col-md-6">
                    <UserList />
                </div>
                <div className="col-md-6">
                    <Statistics />
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
