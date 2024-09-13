const {select, input, checkbox} = require('@inquirer/prompts')

let meta = {
    value: "Tomar 2L de água por dia",
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta"})

    if(meta.length == 0){
        console.log("   A Meta Não Pode Estar Vazia")
        return
    }

    metas.push(
        {value: meta, checked: false}
    )
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as Setas para mudar de meta, Barra de Espaço para marcar ou desmarcar, e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0) {
        console.log("   Nenhuma meta selecionada!")
        return
    }

    respostas.forEach((resposta) =>{
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log("   Meta(s) concluída(s)")
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log("   Não há nenhuma meta realizada! :(")
        return
    }

    await select({
        message: "  Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })

    console.log(realizadas)
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) =>{
        return meta.checked != true
    })

    if (abertas.length == 0) {
        console.log("   Não existem metas abertas!")
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

    const itensARemover = await checkbox({
        message: "Selecione um item para remover",
        choices: [...metasDesmarcadas],
        instructions: false
    })

    if (itensARemover.length == 0) {
        console.log("   Não há itens para remover!")
        return
    }

    itensARemover.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    console.log("   Metas removidas com sucesso!")
}

const start = async () => {
    while(true){
        
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
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
                case "remover":
                    await removerMetas()
                    break
            case "sair":
                console.log("Até mais!")
                return
        }
        
    }
}

start()