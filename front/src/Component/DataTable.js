import {useNavigate} from "react-router-dom";
import {Table, Tbody, Th, Thead, Tr} from "react-super-responsive-table";
import {REQUESTPAGE_ROUTE} from "../consts";
import {observer} from "mobx-react-lite";

const DataTable = observer(({requests, columns, route}) => {
    const navigate = useNavigate()

    return(
        <Table>
            <Thead>
                <Tr>
                    {columns().map(({label}, key) => <Th key={key}>{label}</Th>)}
                </Tr>
            </Thead>
            <Tbody>
                {requests.map((el, key) =>
                    <Tr key={key} onClick={() => navigate(route + '/' + el.id)}>
                        {columns().map(({field}, key2) => <Th key={key2}>{el[field]}</Th>)}
                    </Tr>)
                }
            </Tbody>
        </Table>
    )
})

export default DataTable;