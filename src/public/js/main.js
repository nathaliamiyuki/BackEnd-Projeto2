// Funções para gerenciamento de tipos de ingressos (admin)
function showAddTicketTypeModal() {
    const modal = document.getElementById('ticketTypeModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('ticketTypeModal');
    modal.style.display = 'none';
}

async function editTicketType(id) {
    try {
        const response = await fetch(`/ticket-types/${id}`);
        const ticketType = await response.json();
        
        document.getElementById('ticketTypeId').value = ticketType.id;
        document.getElementById('ticketTypeName').value = ticketType.name;
        document.getElementById('ticketTypePrice').value = ticketType.price;
        document.getElementById('ticketTypeQuantity').value = ticketType.quantity;
        
        showAddTicketTypeModal();
    } catch (error) {
        console.error('Error fetching ticket type:', error);
        alert('Erro ao carregar dados do tipo de ingresso');
    }
}

async function deleteTicketType(id) {
    if (confirm('Tem certeza que deseja excluir este tipo de ingresso?')) {
        try {
            const response = await fetch(`/ticket-types/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Erro ao excluir tipo de ingresso');
            }
        } catch (error) {
            console.error('Error deleting ticket type:', error);
            alert('Erro ao excluir tipo de ingresso');
        }
    }
}

// Validação de formulários
document.addEventListener('DOMContentLoaded', function() {
    const purchaseForms = document.querySelectorAll('.purchase-form');
    
    purchaseForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const quantity = parseInt(formData.get('quantity'));
            const ticketTypeId = formData.get('ticketTypeId');
            
            try {
                const response = await fetch('/tickets/purchase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ticketTypeId,
                        quantity
                    })
                });

                if (response.ok) {
                    window.location.href = '/tickets';
                } else {
                    const data = await response.json();
                    alert(data.error || 'Erro ao realizar a compra');
                }
            } catch (error) {
                console.error('Error purchasing ticket:', error);
                alert('Erro ao realizar a compra');
            }
        });
    });
});