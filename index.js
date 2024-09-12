const {select, input} = require('@inquirer/prompts')

let meta = {
    value: "Tomar 2L de água por dia",
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta"})

    if(meta.length == 0){
        console.log("A Meta Não Pode Estar Vazia")
        return
    }

    metas.push({value: meta, checked: false})
}

const start = async () => {
    while(true){
        
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastra nota",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao){
            case "cadastrar": 
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                console.log("Vamos Listar")
                break
            case "sair":
                console.log("Até mais!")
                return
        }
        
    }
}

start()