NO_COLOR=\033[0m
OK_COLOR=\033[32m

# Extract version from package.json
VERSION=$(shell jq -r '.version' package.json)

all: build

build:
	@echo "$(OK_COLOR)>>>>>>>>>>BUILDING>>>>>>>>>>$(NO_COLOR)"
	@echo "$(OK_COLOR)Version: $(VERSION)$(NO_COLOR)"
	@docker build -t project-mew:latest -t public.ecr.aws/n6q5v2z5/project-mew:latest -t project-mew:$(VERSION) -t public.ecr.aws/n6q5v2z5/project-mew:$(VERSION) .

push:
	@echo "$(OK_COLOR)>>>>>>>>>>PUSHING>>>>>>>>>>$(NO_COLOR)"
	@docker push public.ecr.aws/n6q5v2z5/project-mew:latest
	@docker push public.ecr.aws/n6q5v2z5/project-mew:$(VERSION)

.PHONY: build push
