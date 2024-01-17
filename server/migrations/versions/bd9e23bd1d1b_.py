"""empty message

Revision ID: bd9e23bd1d1b
Revises: 4c8998bf8c85
Create Date: 2024-01-16 16:02:23.442673

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bd9e23bd1d1b'
down_revision = '4c8998bf8c85'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('trades', schema=None) as batch_op:
        batch_op.add_column(sa.Column('selected_items', sa.JSON(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('trades', schema=None) as batch_op:
        batch_op.drop_column('selected_items')

    # ### end Alembic commands ###