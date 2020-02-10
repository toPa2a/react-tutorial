import React, {useState, useEffect, useCallback, useMemo} from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    const [value, setValue] = useState(0);
    const [visible, setVisible] = useState(true);
    
    if (visible) {
        return (
            <div>
                <button onClick={() => setValue((v) => v + 1)}>+</button>
                <button onClick={() => setVisible(false)}>hide</button>
                <HookCounter value={value} />
                <Notification />
                <PlanetInfo id={value} />
            </div>
        );
    } else {
        return <button onClick={() => setVisible(true)}>show</button>
    }
};

const HookCounter = ({value}) => {
    useEffect(() => {
        console.log('useEffect() component is mounted');
        return () => console.log('useEffect() component is unmounted');
    }, []);
    
    useEffect(() => {
        console.log('useEffect() component is updated');
    });
    
    return <p>{value}</p>
};

const Notification = () => {
    const [visible, setVisible] = useState(true);
    
    useEffect(() => {
        const hide = setTimeout(() => setVisible(false), 2500);
        
        return () => clearTimeout(hide);
    }, []);
    
    return (
        <div>
            {visible && <p>Hello</p>}
        </div>
    );
};
        
const getPlanet = (id) => {
    return fetch(`https://swapi.co/api/planets/${id}`)
        .then(res => res.json())
        .then(data => data);
};
        
const useRequest = (request) => {
    const initialState = useMemo(() => ({
        data: null,
        loading: true,
        error: null
    }), []);
    
    const [dataState, setDataState] = useState(initialState);
        
    useEffect(() => {
        setDataState(initialState);
        
        let cancelled = false;
        
        request()
            .then(data => !cancelled && setDataState({
                data,
                loading: false,
                error: null
            }))
            .catch(error => !cancelled && setDataState({
                data: null,
                loading: false,
                error: true
            }));
        
        return () => cancelled = true;
    }, [request, initialState]);
        
    return dataState;
};
    
const usePlanetInfo = (id) => {
    const request = useCallback(() => getPlanet(id), [id]);
    
    return useRequest(request);
};
        
const PlanetInfo = ({id}) => {
    const {data, loading, error} = usePlanetInfo(id);
        
    if (error) {
        return <div>Something is wrong</div>
    }
    
    if (loading) {
        return <div>loading...</div>
    }
    
    return (
        <div>{id} - {data && data.name}</div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));