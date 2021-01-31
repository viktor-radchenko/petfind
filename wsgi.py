#!/user/bin/env python
import os
import click

from app import create_app, db, models, forms, guard
from app.models import User, Tag, MessageQueue, RegisteredTag
from app.controllers import MessageSender

app = create_app()

ADMIN_FIRST_NAME = os.environ.get("ADMIN_FIRST_NAME", "Test")
ADMIN_LAST_NAME = os.environ.get("ADMIN_LAST_NAME", "Admin")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@default.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")


def add_admin():
    admin = User(
        first_name=ADMIN_FIRST_NAME,
        last_name=ADMIN_LAST_NAME,
        email=ADMIN_EMAIL,
        phone="+9715512312312",
        password=guard.hash_password(ADMIN_PASSWORD),
        activated=True,
        address="Nice Street",
        state="Dubai",
        country="United Arab Emirates",
        city="Dubai",
        roles="admin",
    )
    admin.save()


def add_unregistered_tags():
    for i in range(11, 21):
        tag = Tag(tag_id=f"TEST{i}")
        db.session.add(tag)
    db.session.commit()


def add_registered_tags():
    user = User.query.get(1)
    for i in range(10, 41):
        tag = RegisteredTag(
            tag_id=f'REGS{i}',
            tag_name=f'Tag #{i}',
            address=user.address,
            phone=user.phone,
            email=user.email,
            city=user.city,
            country=user.country,
            state=user.state,
            zip_code=user.zip_code,
            user_id=1,
        )
        db.session.add(tag)
    db.session.commit()


def _init_db():
    db.create_all()
    add_admin()
    add_unregistered_tags()
    add_registered_tags()


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


@app.cli.command()
def send_messages():
    """Activate Message Queue manager and send SMS/email messages"""
    messages = MessageQueue.query.filter_by(sent=False).all()
    sender = MessageSender(messages)
    sender.prepare_messages()
    sender.send_messages()


if __name__ == "__main__":
    app.run()
