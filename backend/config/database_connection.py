from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql+psycopg://neondb_owner:npg_En0gRNYMBxT2@ep-noisy-glitter-a4neqqan-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

engine = create_engine(
    DATABASE_URL
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session