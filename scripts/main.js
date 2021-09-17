
const keyBD = '@usuarios'

let listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
}

function gravarBD() {
    localStorage.setItem(keyBD, JSON.stringify(listaRegistros))
}

function lerBD() {
    const data = localStorage.getItem(keyBD)
    if(data) {
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function desenhar() {
    const tbody = document.getElementById('listaRegistrosBody')
    if (tbody) {
        tbody.innerHTML = listaRegistros.usuarios
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
            return `<tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.salario}</td>
                    <td>${usuario.vendas}</td>
                    <td>${usuario.salarioTotal}</td>
                    <td>
                        <button onclick='perguntarSeDeleta(${usuario.id})' class="vermelho">Deletar</button>
                    </td>
                    </tr>`
            } ).join('')
    }
}

function insertUser(nome, salario, vendas) {
    let salarioTotal = (parseFloat(salario) + (parseFloat(vendas * 0.15))).toFixed(2);

    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, salario, vendas, salarioTotal
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

/*
function editUser(id, nome, salario, vendas) {
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.salario = salario;
    usuario.vendas = vendas;
    gravarBD()
    desenhar()
    vizualizar('lista')
}
*/

function deleteUser(id) {
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    })
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id) {
    if (confirm('Quer deletar esse registro de id '+id+' ?')){
        deleteUser(id)
        desenhar()
    }
}

function limparCampo() {
    document.getElementById('nome').value = ''
    document.getElementById('salario').value = ''
    document.getElementById('vendas').value = ''
}

function vizualizar(pagina, novo=false, id=false) {
    document.body.setAttribute('page', pagina)
    if (pagina === 'cadastro') {
        if (novo) limparCampo()
        if (id) {
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario) {
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('salario').value = usuario.salario
                document.getElementById('vendas').value = usuario.vendas
            }
        }
        document.getElementById('nome').focus()
    }
}

function submeter () {
    alert('Funcionário registrado!')
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        salario: document.getElementById('salario').value,
        vendas: document.getElementById('vendas').value,
    }
    if (data.id) {
        //editUser(data.id, data.nome, data.salario, data.vendas) 
    }else{
        insertUser( data.nome, data.salario, data.vendas)
    }

}


window.addEventListener('load', () => {
    lerBD()
})

