const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Subarea = require('./Subarea');
const Utilizador = require('./Utilizador');
const Centro = require('./Centro');

const Evento = sequelize.define('Evento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localizacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    subareaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subarea,
            key: 'id'
        }
    },
    utilizadorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizador,
            key: 'id'
        }
    },
	foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    centroId: {
        type: DataTypes.INTEGER,
        references: {
            model: Centro,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    hooks: {
        afterSync: async () => {
            try {
                const existingEventos = await Evento.count();
                if (existingEventos === 0) {
                    await Evento.bulkCreate([
                        {
                            nome: 'Jogar uma futebolada',
                            localizacao: 'Campo de jogos Almeida Sobrinho, Santa Cruz da Trapa',
                            data: '2024-08-15',
                            hora: '10:00:00',
                            descricao: 'Venha jogar a bola connosco',
                            ativo: true,
                            subareaId: 3, 
                            utilizadorId: 1, 
                            centroId: 1 
                        },
                        {
                            nome: 'Evento de karts',
                            localizacao: 'Vila Nova do Paiva',
                            data: '2024-09-20',
                            hora: '14:30:00',
                            descricao: 'Venha connosco acelarar e sentir o cheiro a gasolina em Vila Nova Do Paiva',
                            ativo: true,
                            subareaId: 10, 
                            utilizadorId: 1, 
                            centroId: 1 
                        }
                    ]);
                }
            } catch (error) {
                console.error('Erro ao inserir dados pré-definidos de Evento:', error);
            }
        }
    }
});

Subarea.hasMany(Evento, { foreignKey: 'subareaId' });
Evento.belongsTo(Subarea, { foreignKey: 'subareaId' });

Utilizador.hasMany(Evento, { foreignKey: 'utilizadorId' });
Evento.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

Centro.hasMany(Evento, { foreignKey: 'centroId' });
Evento.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = Evento;