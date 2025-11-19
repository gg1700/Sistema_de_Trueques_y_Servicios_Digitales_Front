interface BuysEventProps {
    nombre_evento: string,
    precio_evento: number,
    nombre_organizacion?: string | null,
}

export default function BuysEvent({
    nombre_evento,
    precio_evento,
    nombre_organizacion
}:BuysEventProps){
    return(
        <div>
            <h3>{nombre_evento}</h3>
            <p>{precio_evento}</p>
            <h1>{nombre_evento}</h1>
        </div>
    );
}