const {select, input, checkbox} = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "    Bem vindo(a) ao In.orbit!!"

let meta = {
    value: "Tomar 2L de água por dia",
    checked: false,
}

let metas = [meta]

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta"})

    if(meta.length == 0){
        mensagem = "   A Meta Não Pode Estar Vazia"
        return
    }

    metas.push(
        {value: meta, checked: false}
    )

    mensagem = "    Meta cadastrada com sucesso"
}

const listarMetas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const respostas = await checkbox({
        message: "Use as Setas para mudar de meta, Barra de Espaço para marcar ou desmarcar, e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0) {
        mensagem = "   Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) =>{
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "   Meta(s) concluída(s)"
}

const metasRealizadas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "   Não há nenhuma meta realizada! :("
        return
    }

    await select({
        message: "  Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })

    console.log(realizadas)
}

const metasAbertas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas"
        return
    }

    const abertas = metas.filter((meta) =>{
        return meta.checked != true
    })

    if (abertas.length == 0) {
        mensagem = "   Não existem metas abertas!"
        return
    }

    await select({
        message: "  Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })

    console.log(abertas)
}

const removerMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    
    if (metasDesmarcadas.length == 0) {
        mensagem = "   Não há itens para remover!"
        return
    }

    const itensARemover = await checkbox({
        message: "Selecione um ou mais itens para remover",
        choices: [...metasDesmarcadas, "Remover Todas"],
        instructions: false
    })

    //Validando nenhuma seleção marcada
    if (itensARemover.length == 0) {
        mensagem = "   Não há itens para remover!"
        return
    }

    //Nova funcionalidade de remover todas :*
    let removerTodas = false
    itensARemover.forEach((item) => {
        removerTodas = item == "Remover Todas"
    })

    if(removerTodas) {
        metas = []
        mensagem = "   Todas as Metas removidas com sucesso!"

    } else {

        itensARemover.forEach((item) => {
            metas = metas.filter((meta) => {
                return meta.value != item
            })
        })
        mensagem = "   Metas removidas com sucesso!"
    }
}

const mostrarMensagem = () => {
    console.clear()

    if (mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()
    
    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastra meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Remover Metas",
                    value: "remover"
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
                await salvarMetas()
                break
            case "listar":
                await listarMetas()
                await salvarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
                case "remover":
                    await removerMetas()
                    await salvarMetas()
                    break
            case "sair":
                console.log("Até mais!")
                return
        }
        
    }
}

start()