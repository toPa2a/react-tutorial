import React, {useState, useEffect} from 'react';
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
        
const PlanetInfo = ({id}) => {
    const [name, setName] = useState('Planet Name');
        
    useEffect(() => {
        let cancelled = false;
        
        fetch(`https://swapi.co/api/planets/${id}`)
            .then(res => res.json())
            .then(({name}) => !cancelled && setName(name));
        
        return () => cancelled = true;
    }, [id]);
        
    return (
        <div>{id} - {name}</div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));