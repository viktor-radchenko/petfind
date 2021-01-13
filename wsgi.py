#!/user/bin/env python
import os
import click

from app import create_app, db, models, forms, guard
from app.models import User, Tag

app = create_app()

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@default.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")


def add_admin():
    db.session.add(
        User(
            username=ADMIN_USERNAME,
            email=ADMIN_EMAIL,
            password=guard.hash_password(ADMIN_PASSWORD),
            roles="admin",
        )
    )
    db.session.commit()


def add_tags():
    for i in range(11, 21):
        tag = Tag(tag_id=f"TEST{i}")
        db.session.add(tag)
    db.session.commit()


def _init_db():
    db.create_all()
    add_admin()
    add_tags()


# flask cli context setup
@app.shell_context_processor
def get_context():
    """Objects exposed here will be automatically available from the shell."""
    return dict(app=app, db=db, models=models, forms=forms)


@app.cli.command()
@click.confirmation_option(prompt="Delete all data from database tables?")
def reset_db():
    """Reset the current database."""
    db.drop_all()
    _init_db()


@app.cli.command()
def create_db():
    """Create the configured database."""
    db.create_all()


@app.cli.command()
@click.confirmation_option(prompt="Drop all database tables?")
def drop_db():
    """Drop the current database."""
    db.drop_all()


if __name__ == "__main__":
    app.run()
