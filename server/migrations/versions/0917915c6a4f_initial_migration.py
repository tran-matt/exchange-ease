"""Initial migration

Revision ID: 0917915c6a4f
Revises: 
Create Date: 2024-01-05 16:39:32.082178

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0917915c6a4f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('item_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=60), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('items',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('type_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name=op.f('fk_items_owner_id_users')),
    sa.ForeignKeyConstraint(['type_id'], ['item_types.id'], name=op.f('fk_items_type_id_item_types')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('reviewing_user_id', sa.Integer(), nullable=False),
    sa.Column('reviewed_user_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['reviewed_user_id'], ['users.id'], name=op.f('fk_reviews_reviewed_user_id_users')),
    sa.ForeignKeyConstraint(['reviewing_user_id'], ['users.id'], name=op.f('fk_reviews_reviewing_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('trades',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('initiator_id', sa.Integer(), nullable=False),
    sa.Column('receiver_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('trade_cost', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['initiator_id'], ['users.id'], name=op.f('fk_trades_initiator_id_users')),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], name=op.f('fk_trades_receiver_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('trade_item_association',
    sa.Column('trade_id', sa.Integer(), nullable=True),
    sa.Column('item_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['item_id'], ['items.id'], name=op.f('fk_trade_item_association_item_id_items')),
    sa.ForeignKeyConstraint(['trade_id'], ['trades.id'], name=op.f('fk_trade_item_association_trade_id_trades'))
    )
    op.create_table('user_item_association',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('item_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['item_id'], ['items.id'], name=op.f('fk_user_item_association_item_id_items')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_item_association_user_id_users'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_item_association')
    op.drop_table('trade_item_association')
    op.drop_table('trades')
    op.drop_table('reviews')
    op.drop_table('items')
    op.drop_table('users')
    op.drop_table('item_types')
    # ### end Alembic commands ###
