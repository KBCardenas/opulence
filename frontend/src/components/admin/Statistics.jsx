import { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    userCount: 0,
    productCount: 0,
    orderStatusCount: [],
    salesByCategory: [],
    lowStockProducts: [],
    topUsers: [],
    leastSellingProducts: [],
    inactiveUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token no encontrado');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/estadisticas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setStatistics(response.data);
        } else {
          setError('No se recibieron datos de las estadísticas');
        }
        setLoading(false);
      } catch (error) {
        setError('Error al cargar las estadísticas');
        setLoading(false);
        console.error('Error:', error);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Estadísticas del Sistema</h2>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h4><i className="fas fa-users"></i> Total de Usuarios</h4>
              <p className="display-4">{statistics.userCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <h4><i className="fas fa-cogs"></i> Total de Productos</h4>
              <p className="display-4">{statistics.productCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card border-warning shadow-sm">
            <div className="card-body text-center">
              <h4><i className="fas fa-box"></i> Total de Pedidos</h4>
              <p className="display-4">{statistics.orderStatusCount.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-info shadow-sm">
            <div className="card-body">
              <h5><i className="fas fa-chart-bar"></i> Ventas por Categoría</h5>
              <ul>
                {statistics.salesByCategory.length > 0 ? (
                  statistics.salesByCategory.map((category, index) => (
                    <li key={index}>{category._id}: {category.totalVentas}</li>
                  ))
                ) : (
                  <li>No hay ventas por categoría disponibles.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-danger shadow-sm">
            <div className="card-body">
              <h5><i className="fas fa-exclamation-triangle"></i> Productos con Bajo Stock</h5>
              <ul>
                {statistics.lowStockProducts.length > 0 ? (
                  statistics.lowStockProducts.map((product, index) => (
                    <li key={index}>{product.nombre}</li>
                  ))
                ) : (
                  <li>No hay productos con bajo stock.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-secondary shadow-sm">
            <div className="card-body">
              <h5><i className="fas fa-users-cog"></i> Usuarios Más Activos</h5>
              <ul>
                {statistics.topUsers.length > 0 ? (
                  statistics.topUsers.map((user, index) => (
                    <li key={index}>Usuario ID: {user._id} - Pedidos: {user.totalPedidos}</li>
                  ))
                ) : (
                  <li>No hay usuarios activos disponibles.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-light shadow-sm">
            <div className="card-body">
              <h5><i className="fas fa-thumbs-down"></i> Productos Menos Vendidos</h5>
              <ul>
                {statistics.leastSellingProducts.length > 0 ? (
                  statistics.leastSellingProducts.map((product, index) => (
                    <li key={index}>{product.nombre}</li>
                  ))
                ) : (
                  <li>No hay productos menos vendidos.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="card border-dark shadow-sm">
            <div className="card-body">
              <h5><i className="fas fa-user-slash"></i> Usuarios Inactivos</h5>
              <ul>
                {statistics.inactiveUsers.length > 0 ? (
                  statistics.inactiveUsers.map((user, index) => (
                    <li key={index}>Usuario ID: {user._id}</li>
                  ))
                ) : (
                  <li>No hay usuarios inactivos.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
