import { useSearchParams } from "react-router-dom";
import { searchService } from "./../../api/apiUtils";
import { orderCategories } from "./../../utils/categories";
import { reorderSearch, SearhResultInterface } from "../../utils/reorderSearch";
import { useState, useEffect } from "react";
import available from "./../../assets/shipping-car.png";
import { useNavigate } from "react-router-dom";
import "./SearchResult.css";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Estado Inicial del resultado de la busqueda basada en una interface para asegurar le integridad del resultado
 */
const searchResultInitialState: SearhResultInterface = {
  author: { name: "", lastname: "" },
  categories: [],
  items: [],
};

/**
 * Este Componente Realiza y muestra los resultados de la busqueda
 */
export const SearchResult = () => {
  const [searchResult, setSearchResult] = useState<SearhResultInterface>(
    searchResultInitialState
  );
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  let productSearch = searchParams.get("search");

  useEffect(() => {
    const search = async () => {
      /**
       * En las siguientes lineas consumimos y reordenamos la respuesta del servicio de busqueda.
       * Tambien se guarda en un estado esta respuesta reordenada.
       * Todo esto en un usseEffect para que suceda cuando el componente carga por primera vez.
       */
      const response = (await searchService(productSearch as string)) as any;
      const reorderSeaarch = reorderSearch(response);
      setSearchResult(reorderSeaarch);
    };

    search();
  }, []);

  /**
   * Función encargada de renderizar cada uno de los items limitando la repsuesta a 4 resultados
   */
  function items() {
    const listItems = searchResult.items.map(
      (item: any, index: any) =>
        index < 4 && (
          <div className="resultados" key={index}>
            <div className="row">
              <div className="col-md-2">
                <img
                  className="img-producto"
                  src={item.picture}
                  alt="producto"
                  onClick={() => detailProduct(item.id)}
                  data-testid="detail_button"
                />
              </div>
              <div className="col-md-8">
                <div className="cost">
                  <p className="price">$ {item.price.amount}</p>
                  {item.free_shipping && (
                    <img
                      className="shipping-img"
                      src={available}
                      alt="shipping"
                    />
                  )}
                </div>
                <p className="description">{item.title}</p>
              </div>
              <div className="col-md-2">
                <p className="third-text">{item.price.currency}</p>
              </div>
            </div>
          </div>
        )
    );

    return <div className="container border-radius-white">{listItems}</div>;
  }

  /**
   * Función encargada de dirigir a la vista de detalle
   */
  function detailProduct(id: string) {
    navigate({
      pathname: "/items/" + id,
    });
  }

  return (
    <div className="search-page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="breadcrum p-0">
              <p>{orderCategories(searchResult)}</p>
            </div>
          </div>
        </div>
      </div>
      {items()}
    </div>
  );
};

export default SearchResult;
