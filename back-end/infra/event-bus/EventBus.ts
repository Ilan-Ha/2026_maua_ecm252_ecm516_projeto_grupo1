import axios from "axios";

interface Subscriber {
    serviceName: string;
    calbackUrl: string;
}

class EventBus {

    private subscribers: Map<string, Subscriber[]> = new Map()

    private registered_events: string[] = [];

    // funcao para debug, usada para visualizar os eventos e seus inscritos
    snapshot () {
        return { 
            events: [...this.subscribers.keys()],
            subscribers: Object.fromEntries(this.subscribers)
        };
    }

    // método comum reutilizavel para registrar um evento
    register_new_event (
        event_string_identifier: string
    ) {

        // caso o evento ja esteja registrado, apenas retorna
        if (this.registered_events.includes(event_string_identifier)) {
            // TODO levantar um aviso para ser apitado no terminal do gateway
            return; 
        }

        // registra o evento na lista de eventos
        // TODO adicionar um feedback tambem no console para dizer que o evento foi registrado
        this.registered_events.push(event_string_identifier);

        // faz o set no map também quando um novo evento é criado e cheeca se ele ja existe no map
        if(!this.subscribers.has(event_string_identifier)){
            this.subscribers.set(event_string_identifier, [])
        }

    }

    // método comum reutilizavel para inscrever um mss para a um evento
    subscribe (
        serviceName: string,
        calbackUrl: string,
        eventNames: string[]
    ) {

        for ( const eventName of eventNames) {
            
            /* 
            - quando um servidor for se inscrever em um evento
            - se o evento não foi cadastrado no mapa de eventos do bus
            -> adiciona uma coleção para o evento no mapa
            */
    
            this.register_new_event(eventName);

            // variável REFERENCIANDO o array dentro de subscribers, pass by reference

            const clientes: any = this.subscribers.get(eventName)
    
            // checagem devido a graceful shutdown não funcionar
            // funciona para checar se existe algum serviço registrado duplamente para um evento, previnindo duplicatas
                    
            const isThere = clientes.some(client => client.serviceName === serviceName && client.calbackUrl === calbackUrl)
    
            // se o servidor ja havia se inscrito
            // teve que desligar 
            // e re-ligou
            // não se re-inscreve
            
            if(!isThere){
            // adiciona diretamente ao objeto this.subscribers por conta de clientes ser um pass by reference
                clientes.push({
                serviceName,
                calbackUrl
                })
                
                console.log(`${serviceName} escutando ${eventName}`)
            }
            else {
                console.log(`${serviceName} não se inscreveu em ${eventName} por já estar inscrito.`)
            }
            
        }

    }

    // método comum reutilizavel para desinscrever um mss de um evento

    unsubscribe (
        serviceName: string,
        calbackUrl: string,
        eventNames: string[]
    ) {

        // para cada evento passado
        for (const eventName of eventNames) {
            // pegue todos os inscritos
            const subscribersForEvent = this.subscribers.get(eventName);
            // atribuição e checagem para array
            if (Array.isArray(subscribersForEvent)) {
                // Remove apenas o serviço que tenha o mesmo serviceName E o mesmo calbackUrl
                const updatedSubscribers = subscribersForEvent.filter(
                    (service: Subscriber) =>
                        service.serviceName !== serviceName || service.calbackUrl !== calbackUrl
                );

                console.log(`${serviceName} se desinscreveu de ${eventName}`);

                this.subscribers.set(eventName, updatedSubscribers);
            }
        }
    }

    /* 
    método reutilizavel para fazer o post de um evento para o barramento, 
    avisando todos os subscribers desse evento e passando o devido payload
    */

    async publish(event: string, payload: unknown): Promise<void> {
        const subscribersForEvent = this.subscribers.get(event);

        // Garante que é array, pois Map<string, Subscriber[]> pode ser undefined caso o evento não exista
        if (!Array.isArray(subscribersForEvent)) return;

        await Promise.allSettled(
            subscribersForEvent.map(async (subscriber: Subscriber) => {
                try {
                    await axios.post(subscriber.calbackUrl, { event, payload });
                    console.log(`Evento ${event} enviado para ${subscriber.serviceName}`);
                } catch (e) {
                    console.error(`Erro ao enviar evento ${event} para ${subscriber.serviceName}:`, e);
                }
            })
        );
    }
}

export default EventBus;
