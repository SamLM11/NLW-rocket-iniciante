const {select} = require('@inquirer/prompts')

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
                console.log("Vamos Cadastrar")
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